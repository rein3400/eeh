<?php
// Automatic sitemap generator for SEO optimization
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function generateSitemap() {
    $baseUrl = 'https://expressenglishhub.com';
    $today = date('Y-m-d');
    
    // Start sitemap XML
    $sitemap = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $sitemap .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' . "\n";
    $sitemap .= '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"' . "\n";
    $sitemap .= '        xmlns:xhtml="http://www.w3.org/1999/xhtml"' . "\n";
    $sitemap .= '        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"' . "\n";
    $sitemap .= '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' . "\n";
    $sitemap .= '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">' . "\n\n";
    
    // Static pages with high priority and optimized SEO
    $staticPages = [
        [
            'url' => '/',
            'priority' => '1.0',
            'changefreq' => 'daily',
            'title' => 'Express English Hub - TOEFL Preparation Platform',
            'description' => 'Platform persiapan TOEFL ITP dan iBT terbaik dengan trainer bersertifikat ETS'
        ],
        [
            'url' => '/toefl-itp',
            'priority' => '0.9',
            'changefreq' => 'weekly',
            'title' => 'TOEFL ITP Preparation Course',
            'description' => 'Kursus persiapan TOEFL ITP lengkap dengan strategi dan tips sukses'
        ],
        [
            'url' => '/toefl-ibt',
            'priority' => '0.9',
            'changefreq' => 'weekly',
            'title' => 'TOEFL iBT Preparation Course',
            'description' => 'Persiapan TOEFL iBT komprehensif untuk skor tinggi'
        ],
        [
            'url' => '/products',
            'priority' => '0.8',
            'changefreq' => 'weekly',
            'title' => 'TOEFL Course Products',
            'description' => 'Paket kursus TOEFL terlengkap untuk berbagai kebutuhan'
        ],
        [
            'url' => '/blog',
            'priority' => '0.8',
            'changefreq' => 'daily',
            'title' => 'TOEFL Tips and Strategies Blog',
            'description' => 'Tips, strategi, dan panduan TOEFL terbaru dari expert'
        ],
        [
            'url' => '/contact',
            'priority' => '0.7',
            'changefreq' => 'monthly',
            'title' => 'Contact Express English Hub',
            'description' => 'Hubungi kami untuk konsultasi TOEFL gratis'
        ]
    ];
    
    foreach ($staticPages as $page) {
        $sitemap .= "  <url>\n";
        $sitemap .= "    <loc>{$baseUrl}{$page['url']}</loc>\n";
        $sitemap .= "    <lastmod>{$today}</lastmod>\n";
        $sitemap .= "    <changefreq>{$page['changefreq']}</changefreq>\n";
        $sitemap .= "    <priority>{$page['priority']}</priority>\n";
        $sitemap .= "    <mobile:mobile/>\n";
        $sitemap .= "    <image:image>\n";
        $sitemap .= "      <image:loc>{$baseUrl}/logo.jpg</image:loc>\n";
        $sitemap .= "      <image:title>{$page['title']}</image:title>\n";
        $sitemap .= "      <image:caption>{$page['description']}</image:caption>\n";
        $sitemap .= "    </image:image>\n";
        $sitemap .= "  </url>\n\n";
    }
    
    // Dynamic articles from articles folder
    $articlesDir = __DIR__ . '/../articles/';
    if (is_dir($articlesDir)) {
        $articles = glob($articlesDir . '*.html');
        
        foreach ($articles as $articlePath) {
            $filename = basename($articlePath);
            $articleContent = file_get_contents($articlePath);
            
            // Extract title and meta description from HTML
            preg_match('/<title>(.*?)<\/title>/', $articleContent, $titleMatch);
            preg_match('/<meta name="description" content="(.*?)"/', $articleContent, $descMatch);
            preg_match('/<meta name="keywords" content="(.*?)"/', $articleContent, $keywordsMatch);
            
            $title = isset($titleMatch[1]) ? $titleMatch[1] : 'TOEFL Article';
            $description = isset($descMatch[1]) ? $descMatch[1] : 'Professional TOEFL preparation article';
            $keywords = isset($keywordsMatch[1]) ? $keywordsMatch[1] : 'TOEFL, preparation, tips';
            
            // Get file modification time
            $modTime = date('Y-m-d', filemtime($articlePath));
            
            $sitemap .= "  <url>\n";
            $sitemap .= "    <loc>{$baseUrl}/articles/{$filename}</loc>\n";
            $sitemap .= "    <lastmod>{$modTime}</lastmod>\n";
            $sitemap .= "    <changefreq>monthly</changefreq>\n";
            $sitemap .= "    <priority>0.7</priority>\n";
            $sitemap .= "    <mobile:mobile/>\n";
            
            // Add news markup for fresh content
            if ((time() - filemtime($articlePath)) < (7 * 24 * 60 * 60)) { // Within 7 days
                $sitemap .= "    <news:news>\n";
                $sitemap .= "      <news:publication>\n";
                $sitemap .= "        <news:name>Express English Hub</news:name>\n";
                $sitemap .= "        <news:language>id</news:language>\n";
                $sitemap .= "      </news:publication>\n";
                $sitemap .= "      <news:publication_date>{$modTime}</news:publication_date>\n";
                $sitemap .= "      <news:title>" . htmlspecialchars($title) . "</news:title>\n";
                $sitemap .= "      <news:keywords>" . htmlspecialchars($keywords) . "</news:keywords>\n";
                $sitemap .= "    </news:news>\n";
            }
            
            $sitemap .= "    <image:image>\n";
            $sitemap .= "      <image:loc>{$baseUrl}/logo.jpg</image:loc>\n";
            $sitemap .= "      <image:title>" . htmlspecialchars($title) . "</image:title>\n";
            $sitemap .= "      <image:caption>" . htmlspecialchars($description) . "</image:caption>\n";
            $sitemap .= "    </image:image>\n";
            $sitemap .= "  </url>\n\n";
        }
    }
    
    $sitemap .= "</urlset>\n";
    
    // Ensure public directory exists
    $publicDir = __DIR__ . '/../public/';
    if (!is_dir($publicDir)) {
        if (!mkdir($publicDir, 0755, true)) {
            throw new Exception('Failed to create public directory');
        }
    }
    
    // Save sitemap
    $sitemapPath = $publicDir . 'sitemap.xml';
    if (file_put_contents($sitemapPath, $sitemap) === false) {
        throw new Exception('Failed to save sitemap file');
    }
    
    return [
        'success' => true,
        'message' => 'Sitemap updated successfully',
        'articles_count' => count($articles ?? []),
        'total_urls' => count($staticPages) + count($articles ?? [])
    ];
}

// Auto-generate sitemap
try {
    $result = generateSitemap();
    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>