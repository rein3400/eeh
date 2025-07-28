<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
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

if (!$input) {
    echo json_encode(['success' => false, 'error' => 'Invalid request data']);
    exit;
}

// Validate required fields
$required_fields = ['name', 'email', 'message'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    echo json_encode([
        'success' => false, 
        'error' => 'Missing required fields: ' . implode(', ', $missing_fields)
    ]);
    exit;
}

// Sanitize input
$name = trim($input['name']);
$email = trim($input['email']);
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$subject = isset($input['subject']) ? trim($input['subject']) : 'Contact Form Submission';
$message = trim($input['message']);
$program = isset($input['program']) ? trim($input['program']) : 'General Inquiry';

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

// Validate message length
if (strlen($message) < 10) {
    echo json_encode(['success' => false, 'error' => 'Message must be at least 10 characters long']);
    exit;
}

// Rate limiting (simple implementation)
session_start();
$current_time = time();
$last_submission = isset($_SESSION['last_contact_submission']) ? $_SESSION['last_contact_submission'] : 0;

if ($current_time - $last_submission < 60) { // 1 minute rate limit
    echo json_encode(['success' => false, 'error' => 'Please wait before submitting another message']);
    exit;
}

try {
    // Email configuration - Update these with your actual email settings
    $to_email = 'admin@expressenglishhub.com'; // Change to your email
    $from_email = 'noreply@expressenglishhub.com'; // Change to your domain email
    $reply_to = $email;
    
    // Create email content
    $email_subject = "EEH Contact Form: " . $subject;
    
    $email_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #e97311; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #e97311; }
        .footer { text-align: center; padding: 20px; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Express English Hub - New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Name:</span> " . htmlspecialchars($name) . "
            </div>
            <div class='field'>
                <span class='label'>Email:</span> " . htmlspecialchars($email) . "
            </div>
            <div class='field'>
                <span class='label'>Phone:</span> " . htmlspecialchars($phone) . "
            </div>
            <div class='field'>
                <span class='label'>Program Interest:</span> " . htmlspecialchars($program) . "
            </div>
            <div class='field'>
                <span class='label'>Subject:</span> " . htmlspecialchars($subject) . "
            </div>
            <div class='field'>
                <span class='label'>Message:</span><br>
                " . nl2br(htmlspecialchars($message)) . "
            </div>
            <div class='field'>
                <span class='label'>Submitted:</span> " . date('Y-m-d H:i:s') . "
            </div>
            <div class='field'>
                <span class='label'>IP Address:</span> " . $_SERVER['REMOTE_ADDR'] . "
            </div>
        </div>
        <div class='footer'>
            <p>This message was sent from the Express English Hub contact form.</p>
        </div>
    </div>
</body>
</html>";

    // Email headers
    $headers = array(
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $from_email,
        'Reply-To: ' . $reply_to,
        'X-Mailer: PHP/' . phpversion()
    );

    // Send email
    $mail_sent = mail($to_email, $email_subject, $email_body, implode("\r\n", $headers));

    if ($mail_sent) {
        // Store submission data to file (optional - for backup)
        $log_data = array(
            'timestamp' => date('Y-m-d H:i:s'),
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'program' => $program,
            'subject' => $subject,
            'message' => $message,
            'ip' => $_SERVER['REMOTE_ADDR']
        );
        
        $log_file = __DIR__ . '/../contact_submissions.log';
        file_put_contents($log_file, json_encode($log_data) . "\n", FILE_APPEND | LOCK_EX);
        
        // Update session to prevent spam
        $_SESSION['last_contact_submission'] = $current_time;
        
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.'
        ]);
    } else {
        throw new Exception('Failed to send email');
    }

} catch (Exception $e) {
    error_log('Contact form error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Sorry, there was a problem sending your message. Please try again later or contact us directly.'
    ]);
}
?>