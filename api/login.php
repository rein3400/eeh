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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['username']) || !isset($input['password'])) {
    echo json_encode(['success' => false, 'error' => 'Username and password are required']);
    exit;
}

$username = trim($input['username']);
$password = trim($input['password']);

// Admin credentials
$admin_username = 'Reze';
$admin_password = 'Denji';

try {
    if ($username === $admin_username && $password === $admin_password) {
        // Generate session token
        $session_token = bin2hex(random_bytes(32));
        
        // Store in session
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        $_SESSION['session_token'] = $session_token;
        $_SESSION['login_time'] = time();
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'token' => $session_token,
            'username' => $username,
            'login_time' => date('Y-m-d H:i:s')
        ]);
    } else {
        // Add small delay to prevent brute force
        sleep(1);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid username or password'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Authentication error: ' . $e->getMessage()
    ]);
}
?>