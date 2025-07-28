<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Logout
        session_destroy();
        echo json_encode([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    } else {
        // Check authentication status
        if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
            // Check session timeout (24 hours)
            $session_timeout = 24 * 60 * 60; // 24 hours
            if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > $session_timeout) {
                session_destroy();
                echo json_encode([
                    'success' => false,
                    'authenticated' => false,
                    'error' => 'Session expired'
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'authenticated' => true,
                    'username' => $_SESSION['admin_username'],
                    'login_time' => isset($_SESSION['login_time']) ? date('Y-m-d H:i:s', $_SESSION['login_time']) : null
                ]);
            }
        } else {
            echo json_encode([
                'success' => true,
                'authenticated' => false
            ]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Authentication check error: ' . $e->getMessage()
    ]);
}
?>