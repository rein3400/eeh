<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'status' => 'success',
    'message' => 'PHP is working perfectly!',
    'php_version' => phpversion(),
    'curl_enabled' => function_exists('curl_init'),
    'time' => date('Y-m-d H:i:s'),
    'server_info' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
]);
?>