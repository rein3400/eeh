<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['filename']) || empty($input['filename'])) {
    echo json_encode(['success' => false, 'error' => 'Filename is required']);
    exit;
}

$filename = $input['filename'];

// Security check - only allow html files and prevent path traversal
if (!preg_match('/^[a-zA-Z0-9_-]+\.html$/', $filename)) {
    echo json_encode(['success' => false, 'error' => 'Invalid filename']);
    exit;
}

$filePath = __DIR__ . '/../articles/' . $filename;

try {
    if (!file_exists($filePath)) {
        echo json_encode(['success' => false, 'error' => 'File not found']);
        exit;
    }

    if (unlink($filePath)) {
        echo json_encode(['success' => true, 'message' => 'Article deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to delete file']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>