<?php
// API Health Check Endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$health = [
    'status' => 'healthy',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'memory_usage' => memory_get_usage(true),
    'memory_peak' => memory_get_peak_usage(true),
    'disk_free_space' => disk_free_space(__DIR__),
    'services' => []
];

// Check database connection (if applicable)
$health['services']['database'] = 'not_configured';

// Check file system permissions
$articlesDir = __DIR__ . '/../articles/';
$health['services']['articles_directory'] = [
    'exists' => is_dir($articlesDir),
    'writable' => is_writable($articlesDir),
    'readable' => is_readable($articlesDir)
];

$publicDir = __DIR__ . '/../public/';
$health['services']['public_directory'] = [
    'exists' => is_dir($publicDir),
    'writable' => is_writable($publicDir),
    'readable' => is_readable($publicDir)
];

// Check required PHP extensions
$requiredExtensions = ['curl', 'json', 'zip', 'dom'];
$health['services']['php_extensions'] = [];

foreach ($requiredExtensions as $ext) {
    $health['services']['php_extensions'][$ext] = extension_loaded($ext);
}

// Check API endpoints
$endpoints = [
    'test-php.php',
    'login.php',
    'auth-check.php',
    'articles.php',
    'contact.php'
];

$health['services']['api_endpoints'] = [];
foreach ($endpoints as $endpoint) {
    $health['services']['api_endpoints'][$endpoint] = file_exists(__DIR__ . '/' . $endpoint);
}

// Overall health status
$allHealthy = true;
foreach ($health['services'] as $service => $status) {
    if (is_array($status)) {
        foreach ($status as $check) {
            if ($check === false) {
                $allHealthy = false;
                break 2;
            }
        }
    } elseif ($status === false) {
        $allHealthy = false;
        break;
    }
}

$health['status'] = $allHealthy ? 'healthy' : 'degraded';

// Set appropriate HTTP status code
if (!$allHealthy) {
    http_response_code(503); // Service Unavailable
}

echo json_encode($health, JSON_PRETTY_PRINT);
?>