<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// No authentication required

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

$keywords = trim($input['keywords']);
$count = isset($input['count']) ? max(1, min((int)$input['count'], 5)) : 1; // Limit to 1-5 articles
$language = isset($input['language']) && in_array($input['language'], ['id', 'en']) ? $input['language'] : 'id';

// Validate keywords length
if (strlen($keywords) < 3) {
    echo json_encode(['success' => false, 'error' => 'Keywords must be at least 3 characters long']);
    exit;
}
if (strlen($keywords) > 200) {
    echo json_encode(['success' => false, 'error' => 'Keywords too long (max 200 characters)']);
    exit;
}

// OpenRouter API configuration
$apiKey = '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';
$model = 'google/gemini-2.5-flash';

// Enhanced AI blog generator with professional SEO optimization
$prompts = [
    'id' => "Anda adalah SEO Content Specialist profesional yang ahli menulis artikel TOEFL. Buat artikel blog berkualitas tinggi yang dioptimasi untuk SEO dengan keyword: {keywords}. 

REQUIREMENTS ARTICLE SEO:
- Minimal 1200 kata (untuk mendapat ranking tinggi di Google)
- Gunakan LSI keywords dan semantic keywords yang terkait dengan TOEFL
- Struktur artikel yang SEO-friendly dengan heading hierarchy (H1, H2, H3)
- Meta description yang compelling (155-160 karakter)
- Title tag yang clickable dan SEO optimized (50-60 karakter)
- Internal linking opportunities (tandai dengan [INTERNAL_LINK: topic])
- Schema markup ready content
- FAQ section untuk featured snippets
- Call-to-action yang natural
- Keyword density 1-2% (natural, tidak keyword stuffing)

STRUKTUR ARTIKEL HARUS:
1. Title tag yang menarik dengan primary keyword
2. Meta description yang compelling
3. H1 dengan primary keyword
4. Introduction hook yang menarik (150-200 kata)
5. Table of Contents (ToC) 
6. 4-6 subheading (H2) dengan secondary keywords
7. Subheading detail (H3) untuk topik spesifik
8. FAQ section (minimal 3 pertanyaan)
9. Conclusion dengan CTA
10. Related articles suggestions

GAYA PENULISAN:
- Bahasa Indonesia yang natural dan engaging
- Tone: Friendly, authoritative, helpful
- Gunakan bullet points dan numbered lists untuk readability
- Include statistik dan data jika relevan
- Tambahkan tips actionable dan praktis

FORMAT OUTPUT HTML:
<!DOCTYPE html>
<html lang=\"id\">
<head>
    <title>[SEO-optimized title 50-60 chars]</title>
    <meta name=\"description\" content=\"[Compelling meta description 155-160 chars]\">
    <meta name=\"keywords\" content=\"[Primary keyword, secondary keywords, LSI keywords]\">
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <meta name=\"robots\" content=\"index, follow\">
    <meta name=\"author\" content=\"Express English Hub\">
    <meta property=\"og:title\" content=\"[Title]\">
    <meta property=\"og:description\" content=\"[Meta description]\">
    <meta property=\"og:type\" content=\"article\">
    <meta property=\"article:author\" content=\"Express English Hub\">
    <meta property=\"article:section\" content=\"TOEFL Tips\">
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.8; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            color: #333;
            background: #fff;
        }
        h1 { 
            color: #e97311; 
            font-size: 2.2em; 
            margin-bottom: 10px;
            font-weight: 700;
        }
        h2 { 
            color: #d4640e; 
            font-size: 1.8em; 
            margin-top: 30px;
            margin-bottom: 15px;
            border-left: 4px solid #e97311;
            padding-left: 15px;
        }
        h3 { 
            color: #333; 
            font-size: 1.4em;
            margin-top: 25px;
            margin-bottom: 12px;
        }
        .meta { 
            color: #666; 
            font-size: 14px; 
            margin-bottom: 20px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 5px;
        }
        .toc {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #e97311;
        }
        .toc h3 {
            margin-top: 0;
            color: #e97311;
        }
        .toc ul {
            list-style: none;
            padding-left: 0;
        }
        .toc li {
            margin: 8px 0;
            padding-left: 20px;
            position: relative;
        }
        .toc li:before {
            content: '▶';
            color: #e97311;
            position: absolute;
            left: 0;
        }
        .faq {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .faq-item {
            margin: 15px 0;
            padding: 15px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .faq-question {
            font-weight: bold;
            color: #e97311;
            margin-bottom: 8px;
        }
        .cta {
            background: linear-gradient(135deg, #e97311, #d4640e);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
        }
        .highlight {
            background: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
            border-radius: 5px;
        }
        ul, ol {
            padding-left: 25px;
        }
        li {
            margin: 8px 0;
        }
        blockquote {
            border-left: 4px solid #e97311;
            padding: 15px 20px;
            background: #f9f9f9;
            font-style: italic;
            margin: 20px 0;
        }
        .related-articles {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .related-articles h3 {
            color: #e97311;
            margin-top: 0;
        }
        .related-articles ul {
            list-style: none;
            padding-left: 0;
        }
        .related-articles li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .related-articles a {
            color: #333;
            text-decoration: none;
        }
        .related-articles a:hover {
            color: #e97311;
        }
    </style>
</head>
<body>
    [KONTEN ARTIKEL SESUAI STRUKTUR DI ATAS]
    
    <!-- Schema markup akan ditambahkan otomatis -->
    <script type=\"application/ld+json\">
    {
        \"@context\": \"https://schema.org\",
        \"@type\": \"Article\",
        \"headline\": \"[Article Title]\",
        \"description\": \"[Meta Description]\",
        \"author\": {
            \"@type\": \"Organization\",
            \"name\": \"Express English Hub\"
        },
        \"publisher\": {
            \"@type\": \"Organization\",
            \"name\": \"Express English Hub\",
            \"logo\": \"https://expressenglishhub.com/logo.jpg\"
        },
        \"datePublished\": \"" . date('Y-m-d') . "\",
        \"dateModified\": \"" . date('Y-m-d') . "\",
        \"mainEntityOfPage\": \"[Article URL]\",
        \"keywords\": \"[Keywords list]\",
        \"articleSection\": \"TOEFL Preparation\",
        \"wordCount\": \"[Approximate word count]\"
    }
    </script>
</body>
</html>",
    
    'en' => "You are a professional SEO Content Specialist expert in writing TOEFL articles. Create a high-quality, SEO-optimized blog article with keywords: {keywords}.

SEO ARTICLE REQUIREMENTS:
- Minimum 1200 words (to rank high on Google)
- Use LSI keywords and semantic keywords related to TOEFL
- SEO-friendly article structure with heading hierarchy (H1, H2, H3)
- Compelling meta description (155-160 characters)
- Clickable and SEO optimized title tag (50-60 characters)
- Internal linking opportunities (mark with [INTERNAL_LINK: topic])
- Schema markup ready content
- FAQ section for featured snippets
- Natural call-to-action
- Keyword density 1-2% (natural, no keyword stuffing)

ARTICLE STRUCTURE MUST INCLUDE:
1. Compelling title tag with primary keyword
2. Compelling meta description
3. H1 with primary keyword
4. Introduction hook (150-200 words)
5. Table of Contents (ToC)
6. 4-6 subheadings (H2) with secondary keywords
7. Detailed subheadings (H3) for specific topics
8. FAQ section (minimum 3 questions)
9. Conclusion with CTA
10. Related articles suggestions

WRITING STYLE:
- Natural and engaging English
- Tone: Friendly, authoritative, helpful
- Use bullet points and numbered lists for readability
- Include statistics and data if relevant
- Add actionable and practical tips

HTML OUTPUT FORMAT:
<!DOCTYPE html>
<html lang=\"en\">
<head>
    <title>[SEO-optimized title 50-60 chars]</title>
    <meta name=\"description\" content=\"[Compelling meta description 155-160 chars]\">
    <meta name=\"keywords\" content=\"[Primary keyword, secondary keywords, LSI keywords]\">
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <meta name=\"robots\" content=\"index, follow\">
    <meta name=\"author\" content=\"Express English Hub\">
    <meta property=\"og:title\" content=\"[Title]\">
    <meta property=\"og:description\" content=\"[Meta description]\">
    <meta property=\"og:type\" content=\"article\">
    <meta property=\"article:author\" content=\"Express English Hub\">
    <meta property=\"article:section\" content=\"TOEFL Tips\">
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.8; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            color: #333;
            background: #fff;
        }
        h1 { 
            color: #e97311; 
            font-size: 2.2em; 
            margin-bottom: 10px;
            font-weight: 700;
        }
        h2 { 
            color: #d4640e; 
            font-size: 1.8em; 
            margin-top: 30px;
            margin-bottom: 15px;
            border-left: 4px solid #e97311;
            padding-left: 15px;
        }
        h3 { 
            color: #333; 
            font-size: 1.4em;
            margin-top: 25px;
            margin-bottom: 12px;
        }
        .meta { 
            color: #666; 
            font-size: 14px; 
            margin-bottom: 20px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 5px;
        }
        .toc {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #e97311;
        }
        .toc h3 {
            margin-top: 0;
            color: #e97311;
        }
        .toc ul {
            list-style: none;
            padding-left: 0;
        }
        .toc li {
            margin: 8px 0;
            padding-left: 20px;
            position: relative;
        }
        .toc li:before {
            content: '▶';
            color: #e97311;
            position: absolute;
            left: 0;
        }
        .faq {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .faq-item {
            margin: 15px 0;
            padding: 15px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .faq-question {
            font-weight: bold;
            color: #e97311;
            margin-bottom: 8px;
        }
        .cta {
            background: linear-gradient(135deg, #e97311, #d4640e);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
        }
        .highlight {
            background: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
            border-radius: 5px;
        }
        ul, ol {
            padding-left: 25px;
        }
        li {
            margin: 8px 0;
        }
        blockquote {
            border-left: 4px solid #e97311;
            padding: 15px 20px;
            background: #f9f9f9;
            font-style: italic;
            margin: 20px 0;
        }
        .related-articles {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .related-articles h3 {
            color: #e97311;
            margin-top: 0;
        }
        .related-articles ul {
            list-style: none;
            padding-left: 0;
        }
        .related-articles li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .related-articles a {
            color: #333;
            text-decoration: none;
        }
        .related-articles a:hover {
            color: #e97311;
        }
    </style>
</head>
<body>
    [ARTICLE CONTENT ACCORDING TO STRUCTURE ABOVE]
    
    <!-- Schema markup will be added automatically -->
    <script type=\"application/ld+json\">
    {
        \"@context\": \"https://schema.org\",
        \"@type\": \"Article\",
        \"headline\": \"[Article Title]\",
        \"description\": \"[Meta Description]\",
        \"author\": {
            \"@type\": \"Organization\",
            \"name\": \"Express English Hub\"
        },
        \"publisher\": {
            \"@type\": \"Organization\",
            \"name\": \"Express English Hub\",
            \"logo\": \"https://expressenglishhub.com/logo.jpg\"
        },
        \"datePublished\": \"" . date('Y-m-d') . "\",
        \"dateModified\": \"" . date('Y-m-d') . "\",
        \"mainEntityOfPage\": \"[Article URL]\",
        \"keywords\": \"[Keywords list]\",
        \"articleSection\": \"TOEFL Preparation\",
        \"wordCount\": \"[Approximate word count]\"
    }
    </script>
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
        
        // Ensure articles directory exists
        $articlesDir = __DIR__ . '/../articles/';
        if (!is_dir($articlesDir)) {
            if (!mkdir($articlesDir, 0755, true)) {
                throw new Exception('Failed to create articles directory');
            }
        }
        
        // Save article to file
        $filePath = $articlesDir . $filename;
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