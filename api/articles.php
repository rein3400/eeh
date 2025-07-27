<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$articlesDir = __DIR__ . '/../articles';
$articles = [];

try {
    if (!is_dir($articlesDir)) {
        mkdir($articlesDir, 0755, true);
    }

    $files = glob($articlesDir . '/*.html');
    
    foreach ($files as $file) {
        $filename = basename($file);
        $content = file_get_contents($file);
        
        // Extract title from HTML content
        preg_match('/<title>(.*?)<\/title>/', $content, $titleMatch);
        $title = isset($titleMatch[1]) ? $titleMatch[1] : $filename;
        
        // Get file creation time
        $created = date('Y-m-d H:i:s', filemtime($file));
        
        $articles[] = [
            'title' => $title,
            'filename' => $filename,
            'created' => $created,
            'size' => filesize($file)
        ];
    }
    
    // Sort by creation time (newest first)
    usort($articles, function($a, $b) {
        return strcmp($b['created'], $a['created']);
    });

    echo json_encode([
        'success' => true,
        'articles' => $articles,
        'count' => count($articles)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'articles' => []
    ]);
}
?>