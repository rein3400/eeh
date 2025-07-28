<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
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

if (!$input || !isset($input['keywords']) || empty($input['keywords'])) {
    echo json_encode(['success' => false, 'error' => 'Keywords are required']);
    exit;
}

$keywords = $input['keywords'];
$count = isset($input['count']) ? (int)$input['count'] : 1;
$language = isset($input['language']) ? $input['language'] : 'id';

// OpenRouter API configuration
$apiKey = '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';
$model = 'google/gemini-2.5-flash';

// Language-specific prompts
$prompts = [
    'id' => "Buat artikel blog berkualitas tinggi tentang TOEFL dengan keyword: {keywords}. 
    Artikel harus:
    - Minimal 800 kata
    - Informatif dan edukatif
    - Menggunakan struktur HTML yang proper
    - Memiliki judul yang menarik
    - Menggunakan heading (h1, h2, h3)
    - Memiliki meta description
    - SEO friendly
    - Dalam bahasa Indonesia yang baik dan benar
    
    Format output harus berupa HTML lengkap dengan struktur:
    <!DOCTYPE html>
    <html>
    <head>
        <title>[Judul Artikel]</title>
        <meta name=\"description\" content=\"[Meta description]\">
        <meta charset=\"UTF-8\">
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1, h2, h3 { color: #e97311; }
            .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        [Konten artikel dengan struktur HTML yang proper]
    </body>
    </html>",
    
    'en' => "Create a high-quality TOEFL blog article with keywords: {keywords}.
    The article should:
    - Be at least 800 words
    - Be informative and educational
    - Use proper HTML structure
    - Have an engaging title
    - Use headings (h1, h2, h3)
    - Include meta description
    - Be SEO friendly
    - Be written in proper English
    
    Output format should be complete HTML with structure:
    <!DOCTYPE html>
    <html>
    <head>
        <title>[Article Title]</title>
        <meta name=\"description\" content=\"[Meta description]\">
        <meta charset=\"UTF-8\">
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1, h2, h3 { color: #e97311; }
            .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        [Article content with proper HTML structure]
    </body>
    </html>"
];

$generatedArticles = [];

try {
    for ($i = 0; $i < $count; $i++) {
        $prompt = str_replace('{keywords}', $keywords, $prompts[$language]);
        
        $requestData = [
            'model' => $model,
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'max_tokens' => 4000,
            'temperature' => 0.7
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://openrouter.ai/api/v1/chat/completions');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
            'HTTP-Referer: http://localhost:3000',
            'X-Title: TOEFL Blog Generator'
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_error($ch)) {
            throw new Exception('cURL error: ' . curl_error($ch));
        }
        
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception('API request failed with code: ' . $httpCode . ' Response: ' . $response);
        }

        $result = json_decode($response, true);
        
        if (!$result || !isset($result['choices'][0]['message']['content'])) {
            throw new Exception('Invalid API response: ' . $response);
        }

        $content = $result['choices'][0]['message']['content'];
        
        // Extract title from HTML content
        preg_match('/<title>(.*?)<\/title>/', $content, $titleMatch);
        $title = isset($titleMatch[1]) ? $titleMatch[1] : 'Artikel TOEFL - ' . $keywords;
        
        // Generate filename
        $filename = sanitizeFilename($title) . '_' . date('Y-m-d_H-i-s') . '_' . ($i + 1) . '.html';
        
        // Save article to file
        $filePath = __DIR__ . '/../articles/' . $filename;
        if (file_put_contents($filePath, $content) === false) {
            throw new Exception('Failed to save article file');
        }
        
        $generatedArticles[] = [
            'title' => $title,
            'filename' => $filename,
            'created' => date('Y-m-d H:i:s')
        ];
    }

    echo json_encode([
        'success' => true,
        'count' => count($generatedArticles),
        'articles' => $generatedArticles
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

function sanitizeFilename($filename) {
    // Remove HTML tags
    $filename = strip_tags($filename);
    // Replace spaces with underscores
    $filename = str_replace(' ', '_', $filename);
    // Remove special characters
    $filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $filename);
    // Limit length
    $filename = substr($filename, 0, 50);
    return $filename;
}
?>