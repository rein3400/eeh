<?php
// API Configuration File
class APIConfig {
    
    // Database configuration (if needed in future)
    const DB_HOST = 'localhost';
    const DB_NAME = 'expressenglishhub';
    const DB_USER = 'root';
    const DB_PASS = '';
    
    // Admin credentials
    const ADMIN_USERNAME = 'Reze';
    const ADMIN_PASSWORD = 'Denji';
    
    // Security settings
    const SESSION_TIMEOUT = 86400; // 24 hours
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOGIN_LOCKOUT_TIME = 900; // 15 minutes
    
    // File upload limits
    const MAX_FILE_SIZE = 10485760; // 10MB
    const ALLOWED_FILE_TYPES = ['application/zip', 'application/x-zip-compressed'];
    
    // Rate limiting
    const RATE_LIMIT_REQUESTS = 100;
    const RATE_LIMIT_WINDOW = 3600; // 1 hour
    const CONTACT_RATE_LIMIT = 3; // 3 submissions per hour
    const CONTACT_MIN_INTERVAL = 30; // 30 seconds between submissions
    
    // API settings
    const OPENROUTER_API_KEY = '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';
    const OPENROUTER_MODEL = 'google/gemini-2.5-flash';
    
    // Email settings
    const SMTP_HOST = 'smtp.gmail.com';
    const SMTP_PORT = 587;
    const SMTP_USERNAME = 'admin@expressenglishhub.com';
    const SMTP_PASSWORD = '';
    const FROM_EMAIL = 'noreply@expressenglishhub.com';
    const TO_EMAIL = 'admin@expressenglishhub.com';
    
    // Site settings
    const SITE_URL = 'https://expressenglishhub.com';
    const SITE_NAME = 'Express English Hub';
    
    // Whitelisted IPs for admin access
    const WHITELISTED_IPS = [
        '192.168.100.15',
        '127.0.0.1',
        'localhost',
        '::1'
    ];
    
    // Directory paths
    const ARTICLES_DIR = __DIR__ . '/../articles/';
    const PUBLIC_DIR = __DIR__ . '/../public/';
    const PLUGINS_DIR = __DIR__ . '/../plugins/';
    const LOGS_DIR = __DIR__ . '/../logs/';
    const UPLOADS_DIR = __DIR__ . '/../uploads/';
    
    // Ensure required directories exist
    public static function initDirectories() {
        $dirs = [
            self::ARTICLES_DIR,
            self::PUBLIC_DIR,
            self::PLUGINS_DIR,
            self::LOGS_DIR,
            self::UPLOADS_DIR
        ];
        
        foreach ($dirs as $dir) {
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
        }
    }
    
    // Get client IP address
    public static function getClientIP() {
        $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
        foreach ($ipKeys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                $ip = $_SERVER[$key];
                if (strpos($ip, ',') !== false) {
                    $ip = explode(',', $ip)[0];
                }
                return trim($ip);
            }
        }
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
    
    // Check if IP is whitelisted
    public static function isIPWhitelisted($ip = null) {
        if ($ip === null) {
            $ip = self::getClientIP();
        }
        return in_array($ip, self::WHITELISTED_IPS);
    }
    
    // Validate session
    public static function validateSession() {
        if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
            return false;
        }
        
        // Check session timeout
        if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > self::SESSION_TIMEOUT) {
            session_destroy();
            return false;
        }
        
        // Check IP consistency
        if (isset($_SESSION['login_ip']) && $_SESSION['login_ip'] !== self::getClientIP()) {
            session_destroy();
            return false;
        }
        
        return true;
    }
    
    // Send JSON response
    public static function sendResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
    
    // Send error response
    public static function sendError($message, $statusCode = 400, $details = null) {
        $response = [
            'success' => false,
            'error' => $message
        ];
        
        if ($details !== null) {
            $response['details'] = $details;
        }
        
        self::sendResponse($response, $statusCode);
    }
}

// Initialize directories on load
APIConfig::initDirectories();
?>