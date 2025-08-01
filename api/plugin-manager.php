<?php
// WordPress Plugin Manager API
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Authentication required']);
    exit;
}

// Check session timeout (24 hours)
$session_timeout = 24 * 60 * 60;
if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > $session_timeout) {
    session_destroy();
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Session expired']);
    exit;
}

$pluginsDir = __DIR__ . '/../plugins/';
$activePluginsFile = $pluginsDir . 'active_plugins.json';

// Ensure plugins directory exists
if (!is_dir($pluginsDir)) {
    mkdir($pluginsDir, 0755, true);
}

function getActivePlugins() {
    global $activePluginsFile;
    if (file_exists($activePluginsFile)) {
        return json_decode(file_get_contents($activePluginsFile), true) ?: [];
    }
    return [];
}

function saveActivePlugins($plugins) {
    global $activePluginsFile;
    file_put_contents($activePluginsFile, json_encode($plugins, JSON_PRETTY_PRINT));
}

function extractPlugin($zipPath, $pluginName) {
    global $pluginsDir;
    
    $zip = new ZipArchive;
    if ($zip->open($zipPath) === TRUE) {
        $pluginPath = $pluginsDir . $pluginName . '/';
        
        // Create plugin directory
        if (!is_dir($pluginPath)) {
            mkdir($pluginPath, 0755, true);
        }
        
        // Extract files
        $zip->extractTo($pluginPath);
        $zip->close();
        
        // Look for main plugin file
        $mainFile = null;
        $files = scandir($pluginPath);
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
                $content = file_get_contents($pluginPath . $file);
                // Check if it's a WordPress plugin file (contains plugin header)
                if (preg_match('/Plugin Name:\s*(.+)/i', $content)) {
                    $mainFile = $file;
                    break;
                }
            }
        }
        
        return [
            'success' => true,
            'path' => $pluginPath,
            'main_file' => $mainFile
        ];
    } else {
        return [
            'success' => false,
            'error' => 'Failed to extract ZIP file'
        ];
    }
}

function getPluginInfo($pluginPath) {
    $files = glob($pluginPath . '*.php');
    foreach ($files as $file) {
        $content = file_get_contents($file);
        
        // Extract plugin header information
        $headers = [];
        if (preg_match('/Plugin Name:\s*(.+)/i', $content, $matches)) {
            $headers['name'] = trim($matches[1]);
        }
        if (preg_match('/Description:\s*(.+)/i', $content, $matches)) {
            $headers['description'] = trim($matches[1]);
        }
        if (preg_match('/Version:\s*(.+)/i', $content, $matches)) {
            $headers['version'] = trim($matches[1]);
        }
        if (preg_match('/Author:\s*(.+)/i', $content, $matches)) {
            $headers['author'] = trim($matches[1]);
        }
        if (preg_match('/Author URI:\s*(.+)/i', $content, $matches)) {
            $headers['author_uri'] = trim($matches[1]);
        }
        if (preg_match('/Plugin URI:\s*(.+)/i', $content, $matches)) {
            $headers['plugin_uri'] = trim($matches[1]);
        }
        
        if (!empty($headers)) {
            $headers['main_file'] = basename($file);
            return $headers;
        }
    }
    
    return null;
}

function executePluginHook($hook, $data = null) {
    global $pluginsDir;
    $activePlugins = getActivePlugins();
    $results = [];
    
    foreach ($activePlugins as $pluginName => $pluginData) {
        $pluginPath = $pluginsDir . $pluginName . '/';
        $mainFile = $pluginPath . $pluginData['main_file'];
        
        if (file_exists($mainFile)) {
            // Create a sandbox environment for plugin execution
            $pluginCode = file_get_contents($mainFile);
            
            // Simple hook system - look for hook functions
            $hookFunction = "eeh_hook_{$hook}";
            if (strpos($pluginCode, "function {$hookFunction}") !== false) {
                try {
                    // Include plugin file in controlled manner
                    include_once $mainFile;
                    
                    if (function_exists($hookFunction)) {
                        $result = call_user_func($hookFunction, $data);
                        $results[$pluginName] = $result;
                    }
                } catch (Exception $e) {
                    $results[$pluginName] = ['error' => $e->getMessage()];
                }
            }
        }
    }
    
    return $results;
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            // List all plugins
            $plugins = [];
            $activePlugins = getActivePlugins();
            
            if (is_dir($pluginsDir)) {
                $pluginDirs = glob($pluginsDir . '*', GLOB_ONLYDIR);
                
                foreach ($pluginDirs as $pluginPath) {
                    $pluginName = basename($pluginPath);
                    $pluginInfo = getPluginInfo($pluginPath . '/');
                    
                    if ($pluginInfo) {
                        $plugins[] = [
                            'name' => $pluginName,
                            'info' => $pluginInfo,
                            'active' => isset($activePlugins[$pluginName]),
                            'path' => $pluginPath
                        ];
                    }
                }
            }
            
            echo json_encode([
                'success' => true,
                'plugins' => $plugins,
                'active_count' => count($activePlugins)
            ]);
            break;
            
        case 'POST':
            $action = $_POST['action'] ?? '';
            
            switch ($action) {
                case 'upload':
                    if (!isset($_FILES['plugin_zip'])) {
                        throw new Exception('No file uploaded');
                    }
                    
                    $file = $_FILES['plugin_zip'];
                    
                    if ($file['error'] !== UPLOAD_ERR_OK) {
                        throw new Exception('Upload error: ' . $file['error']);
                    }
                    
                    // Validate file type and size
                    $finfo = finfo_open(FILEINFO_MIME_TYPE);
                    $mimeType = finfo_file($finfo, $file['tmp_name']);
                    finfo_close($finfo);
                    
                    if (!in_array($mimeType, ['application/zip', 'application/x-zip-compressed'])) {
                        throw new Exception('Invalid file type. Only ZIP files are allowed.');
                    }
                    
                    // Check file size (max 10MB)
                    if ($file['size'] > 10 * 1024 * 1024) {
                        throw new Exception('File too large. Maximum size is 10MB.');
                    }
                    
                    // Generate unique plugin name
                    $pluginName = pathinfo($file['name'], PATHINFO_FILENAME);
                    $pluginName = preg_replace('/[^a-zA-Z0-9_-]/', '', $pluginName);
                    
                    // Extract plugin
                    $result = extractPlugin($file['tmp_name'], $pluginName);
                    
                    if ($result['success']) {
                        $pluginInfo = getPluginInfo($result['path']);
                        
                        echo json_encode([
                            'success' => true,
                            'message' => 'Plugin uploaded successfully',
                            'plugin_name' => $pluginName,
                            'plugin_info' => $pluginInfo
                        ]);
                    } else {
                        throw new Exception($result['error']);
                    }
                    break;
                    
                case 'activate':
                    $input = json_decode(file_get_contents('php://input'), true);
                    $pluginName = $input['plugin_name'] ?? '';
                    
                    if (empty($pluginName)) {
                        throw new Exception('Plugin name is required');
                    }
                    
                    $pluginPath = $pluginsDir . $pluginName . '/';
                    if (!is_dir($pluginPath)) {
                        throw new Exception('Plugin not found');
                    }
                    
                    $pluginInfo = getPluginInfo($pluginPath);
                    if (!$pluginInfo) {
                        throw new Exception('Invalid plugin');
                    }
                    
                    $activePlugins = getActivePlugins();
                    $activePlugins[$pluginName] = $pluginInfo;
                    saveActivePlugins($activePlugins);
                    
                    // Execute plugin activation hook
                    executePluginHook('activate', ['plugin' => $pluginName]);
                    
                    echo json_encode([
                        'success' => true,
                        'message' => 'Plugin activated successfully'
                    ]);
                    break;
                    
                case 'deactivate':
                    $input = json_decode(file_get_contents('php://input'), true);
                    $pluginName = $input['plugin_name'] ?? '';
                    
                    if (empty($pluginName)) {
                        throw new Exception('Plugin name is required');
                    }
                    
                    $activePlugins = getActivePlugins();
                    if (isset($activePlugins[$pluginName])) {
                        // Execute deactivation hook
                        executePluginHook('deactivate', ['plugin' => $pluginName]);
                        
                        unset($activePlugins[$pluginName]);
                        saveActivePlugins($activePlugins);
                    }
                    
                    echo json_encode([
                        'success' => true,
                        'message' => 'Plugin deactivated successfully'
                    ]);
                    break;
                    
                case 'execute_hook':
                    $input = json_decode(file_get_contents('php://input'), true);
                    $hook = $input['hook'] ?? '';
                    $data = $input['data'] ?? null;
                    
                    if (empty($hook)) {
                        throw new Exception('Hook name is required');
                    }
                    
                    $results = executePluginHook($hook, $data);
                    
                    echo json_encode([
                        'success' => true,
                        'hook' => $hook,
                        'results' => $results
                    ]);
                    break;
                    
                default:
                    throw new Exception('Invalid action');
            }
            break;
            
        case 'DELETE':
            $input = json_decode(file_get_contents('php://input'), true);
            $pluginName = $input['plugin_name'] ?? '';
            
            if (empty($pluginName)) {
                throw new Exception('Plugin name is required');
            }
            
            $pluginPath = $pluginsDir . $pluginName . '/';
            if (!is_dir($pluginPath)) {
                throw new Exception('Plugin not found');
            }
            
            // Deactivate first
            $activePlugins = getActivePlugins();
            if (isset($activePlugins[$pluginName])) {
                executePluginHook('deactivate', ['plugin' => $pluginName]);
                unset($activePlugins[$pluginName]);
                saveActivePlugins($activePlugins);
            }
            
            // Delete plugin files
            function deleteDirectory($dir) {
                if (!is_dir($dir)) return false;
                
                $files = array_diff(scandir($dir), ['.', '..']);
                foreach ($files as $file) {
                    $filePath = $dir . DIRECTORY_SEPARATOR . $file;
                    is_dir($filePath) ? deleteDirectory($filePath) : unlink($filePath);
                }
                return rmdir($dir);
            }
            
            if (deleteDirectory($pluginPath)) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Plugin deleted successfully'
                ]);
            } else {
                throw new Exception('Failed to delete plugin');
            }
            break;
            
        default:
            throw new Exception('Method not allowed');
    }
    
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>