<?php
// Global Error Handler for API
class APIErrorHandler {
    
    public static function handleError($errno, $errstr, $errfile, $errline) {
        $error = [
            'type' => 'PHP Error',
            'level' => self::getErrorLevel($errno),
            'message' => $errstr,
            'file' => basename($errfile),
            'line' => $errline,
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        // Log error
        error_log(json_encode($error));
        
        // Don't execute PHP internal error handler
        return true;
    }
    
    public static function handleException($exception) {
        $error = [
            'type' => 'PHP Exception',
            'message' => $exception->getMessage(),
            'file' => basename($exception->getFile()),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(),
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        // Log error
        error_log(json_encode($error));
        
        // Send JSON error response
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => 'Internal server error',
            'debug' => $error
        ]);
    }
    
    public static function handleFatalError() {
        $error = error_get_last();
        if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
            $errorData = [
                'type' => 'Fatal Error',
                'message' => $error['message'],
                'file' => basename($error['file']),
                'line' => $error['line'],
                'timestamp' => date('Y-m-d H:i:s')
            ];
            
            // Log error
            error_log(json_encode($errorData));
            
            // Send JSON error response
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => 'Fatal server error',
                'debug' => $errorData
            ]);
        }
    }
    
    private static function getErrorLevel($errno) {
        switch ($errno) {
            case E_ERROR:
                return 'Fatal Error';
            case E_WARNING:
                return 'Warning';
            case E_PARSE:
                return 'Parse Error';
            case E_NOTICE:
                return 'Notice';
            case E_CORE_ERROR:
                return 'Core Error';
            case E_CORE_WARNING:
                return 'Core Warning';
            case E_COMPILE_ERROR:
                return 'Compile Error';
            case E_COMPILE_WARNING:
                return 'Compile Warning';
            case E_USER_ERROR:
                return 'User Error';
            case E_USER_WARNING:
                return 'User Warning';
            case E_USER_NOTICE:
                return 'User Notice';
            case E_STRICT:
                return 'Strict Standards';
            case E_RECOVERABLE_ERROR:
                return 'Recoverable Error';
            case E_DEPRECATED:
                return 'Deprecated';
            case E_USER_DEPRECATED:
                return 'User Deprecated';
            default:
                return 'Unknown Error';
        }
    }
}

// Set error handlers
set_error_handler(['APIErrorHandler', 'handleError']);
set_exception_handler(['APIErrorHandler', 'handleException']);
register_shutdown_function(['APIErrorHandler', 'handleFatalError']);

// Configure error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Ensure logs directory exists
$logsDir = __DIR__ . '/../logs/';
if (!is_dir($logsDir)) {
    mkdir($logsDir, 0755, true);
}

ini_set('error_log', $logsDir . 'api_errors.log');
?>