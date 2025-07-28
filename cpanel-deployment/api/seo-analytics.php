<?php
// Advanced SEO Analytics and Monitoring API
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check authentication for admin-only features
function isAuthenticated() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function analyzeSEO($url, $content = null) {
    $analysis = [
        'url' => $url,
        'score' => 0,
        'issues' => [],
        'recommendations' => [],
        'keywords' => [],
        'meta_analysis' => [],
        'technical_seo' => [],
        'content_analysis' => []
    ];
    
    // If content is not provided, try to fetch it
    if (!$content) {
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'user_agent' => 'Mozilla/5.0 (compatible; SEO Analyzer/1.0)'
            ]
        ]);
        $content = @file_get_contents($url, false, $context);
    }
    
    if (!$content) {
        $analysis['issues'][] = 'Could not fetch page content';
        return $analysis;
    }
    
    // Parse HTML
    $dom = new DOMDocument();
    @$dom->loadHTML($content);
    $xpath = new DOMXPath($dom);
    
    // Title Analysis
    $titleNodes = $xpath->query('//title');
    if ($titleNodes->length > 0) {
        $title = trim($titleNodes->item(0)->nodeValue);
        $titleLength = strlen($title);
        
        if ($titleLength === 0) {
            $analysis['issues'][] = 'Missing title tag';
        } elseif ($titleLength < 30) {
            $analysis['issues'][] = 'Title too short (< 30 characters)';
        } elseif ($titleLength > 60) {
            $analysis['issues'][] = 'Title too long (> 60 characters)';
        } else {
            $analysis['score'] += 10;
        }
        
        $analysis['meta_analysis']['title'] = [
            'content' => $title,
            'length' => $titleLength,
            'status' => ($titleLength >= 30 && $titleLength <= 60) ? 'good' : 'needs_improvement'
        ];
    } else {
        $analysis['issues'][] = 'No title tag found';
    }
    
    // Meta Description Analysis
    $metaDescNodes = $xpath->query('//meta[@name="description"]');
    if ($metaDescNodes->length > 0) {
        $metaDesc = trim($metaDescNodes->item(0)->getAttribute('content'));
        $metaDescLength = strlen($metaDesc);
        
        if ($metaDescLength === 0) {
            $analysis['issues'][] = 'Empty meta description';
        } elseif ($metaDescLength < 120) {
            $analysis['issues'][] = 'Meta description too short (< 120 characters)';
        } elseif ($metaDescLength > 160) {
            $analysis['issues'][] = 'Meta description too long (> 160 characters)';
        } else {
            $analysis['score'] += 10;
        }
        
        $analysis['meta_analysis']['description'] = [
            'content' => $metaDesc,
            'length' => $metaDescLength,
            'status' => ($metaDescLength >= 120 && $metaDescLength <= 160) ? 'good' : 'needs_improvement'
        ];
    } else {
        $analysis['issues'][] = 'No meta description found';
    }
    
    // Meta Keywords Analysis
    $metaKeywordsNodes = $xpath->query('//meta[@name="keywords"]');
    if ($metaKeywordsNodes->length > 0) {
        $keywords = trim($metaKeywordsNodes->item(0)->getAttribute('content'));
        $keywordArray = array_map('trim', explode(',', $keywords));
        $analysis['keywords'] = $keywordArray;
        $analysis['score'] += 5;
    }
    
    // Heading Structure Analysis
    $h1Nodes = $xpath->query('//h1');
    $h2Nodes = $xpath->query('//h2'); 
    $h3Nodes = $xpath->query('//h3');
    
    if ($h1Nodes->length === 0) {
        $analysis['issues'][] = 'No H1 tag found';
    } elseif ($h1Nodes->length > 1) {
        $analysis['issues'][] = 'Multiple H1 tags found';
    } else {
        $analysis['score'] += 10;
    }
    
    $analysis['content_analysis']['headings'] = [
        'h1_count' => $h1Nodes->length,
        'h2_count' => $h2Nodes->length,
        'h3_count' => $h3Nodes->length,
        'structure_score' => ($h1Nodes->length === 1 && $h2Nodes->length >= 2) ? 'good' : 'needs_improvement'
    ];
    
    // Image Analysis
    $imgNodes = $xpath->query('//img');
    $imagesWithoutAlt = $xpath->query('//img[not(@alt) or @alt=""]');
    
    $analysis['content_analysis']['images'] = [
        'total_images' => $imgNodes->length,
        'images_without_alt' => $imagesWithoutAlt->length,
        'alt_coverage' => $imgNodes->length > 0 ? (($imgNodes->length - $imagesWithoutAlt->length) / $imgNodes->length) * 100 : 100
    ];
    
    if ($imagesWithoutAlt->length > 0) {
        $analysis['issues'][] = "{$imagesWithoutAlt->length} images without alt text";
    } else {
        $analysis['score'] += 5;
    }
    
    // Internal Links Analysis
    $internalLinks = $xpath->query('//a[contains(@href, "expressenglishhub.com") or starts-with(@href, "/")]');
    $externalLinks = $xpath->query('//a[starts-with(@href, "http") and not(contains(@href, "expressenglishhub.com"))]');
    
    $analysis['content_analysis']['links'] = [
        'internal_links' => $internalLinks->length,
        'external_links' => $externalLinks->length,
        'link_ratio' => $internalLinks->length > 0 ? $internalLinks->length / ($internalLinks->length + $externalLinks->length) : 0
    ];
    
    if ($internalLinks->length < 3) {
        $analysis['issues'][] = 'Few internal links (< 3)';
    } else {
        $analysis['score'] += 5;
    }
    
    // Word Count Analysis
    $textContent = strip_tags($content);
    $wordCount = str_word_count($textContent);
    
    $analysis['content_analysis']['word_count'] = $wordCount;
    
    if ($wordCount < 300) {
        $analysis['issues'][] = 'Content too short (< 300 words)';
    } elseif ($wordCount >= 1000) {
        $analysis['score'] += 10;
    } else {
        $analysis['score'] += 5;
    }
    
    // Technical SEO Checks
    $canonicalNodes = $xpath->query('//link[@rel="canonical"]');
    if ($canonicalNodes->length > 0) {
        $analysis['score'] += 5;
        $analysis['technical_seo']['canonical'] = $canonicalNodes->item(0)->getAttribute('href');
    } else {
        $analysis['issues'][] = 'No canonical URL specified';
    }
    
    // Open Graph Tags
    $ogTitleNodes = $xpath->query('//meta[@property="og:title"]');
    $ogDescNodes = $xpath->query('//meta[@property="og:description"]');
    $ogImageNodes = $xpath->query('//meta[@property="og:image"]');
    
    $analysis['technical_seo']['open_graph'] = [
        'title' => $ogTitleNodes->length > 0 ? $ogTitleNodes->item(0)->getAttribute('content') : null,
        'description' => $ogDescNodes->length > 0 ? $ogDescNodes->item(0)->getAttribute('content') : null,
        'image' => $ogImageNodes->length > 0 ? $ogImageNodes->item(0)->getAttribute('content') : null
    ];
    
    if ($ogTitleNodes->length > 0 && $ogDescNodes->length > 0 && $ogImageNodes->length > 0) {
        $analysis['score'] += 10;
    } else {
        $analysis['issues'][] = 'Incomplete Open Graph tags';
    }
    
    // Schema.org Structured Data
    $schemaNodes = $xpath->query('//script[@type="application/ld+json"]');
    if ($schemaNodes->length > 0) {
        $analysis['score'] += 10;
        $analysis['technical_seo']['structured_data'] = true;
    } else {
        $analysis['issues'][] = 'No structured data found';
    }
    
    // Generate Recommendations
    if ($analysis['score'] < 50) {
        $analysis['recommendations'][] = 'Focus on basic SEO elements: title, meta description, H1 tag';
    }
    if ($wordCount < 800) {
        $analysis['recommendations'][] = 'Increase content length to at least 800 words for better ranking';
    }
    if ($internalLinks->length < 5) {
        $analysis['recommendations'][] = 'Add more internal links to improve site structure';
    }
    if ($imagesWithoutAlt->length > 0) {
        $analysis['recommendations'][] = 'Add alt text to all images for better accessibility and SEO';
    }
    
    // Calculate final score (out of 100)
    $analysis['score'] = min($analysis['score'], 100);
    $analysis['grade'] = $analysis['score'] >= 80 ? 'A' : ($analysis['score'] >= 60 ? 'B' : ($analysis['score'] >= 40 ? 'C' : 'D'));
    
    return $analysis;
}

function getTopKeywords($content, $limit = 10) {
    // Simple keyword extraction
    $text = strtolower(strip_tags($content));
    $text = preg_replace('/[^a-z\s]/', '', $text);
    
    // Common stop words to exclude
    $stopWords = ['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall', 'of', 'in', 'for', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'];
    
    $words = explode(' ', $text);
    $wordCounts = [];
    
    foreach ($words as $word) {
        $word = trim($word);
        if (strlen($word) > 3 && !in_array($word, $stopWords)) {
            $wordCounts[$word] = isset($wordCounts[$word]) ? $wordCounts[$word] + 1 : 1;
        }
    }
    
    arsort($wordCounts);
    return array_slice($wordCounts, 0, $limit, true);
}

// Main API handling
try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isAuthenticated()) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Authentication required']);
            exit;
        }
        
        $action = $input['action'] ?? '';
        
        switch ($action) {
            case 'analyze_url':
                $url = $input['url'] ?? '';
                if (empty($url)) {
                    throw new Exception('URL is required');
                }
                
                $analysis = analyzeSEO($url);
                echo json_encode([
                    'success' => true,
                    'analysis' => $analysis
                ]);
                break;
                
            case 'analyze_content':
                $content = $input['content'] ?? '';
                if (empty($content)) {
                    throw new Exception('Content is required');
                }
                
                $analysis = analyzeSEO('', $content);
                $keywords = getTopKeywords($content);
                
                echo json_encode([
                    'success' => true,
                    'analysis' => $analysis,
                    'top_keywords' => $keywords
                ]);
                break;
                
            case 'site_audit':
                // Comprehensive site audit
                $pages = [
                    'https://expressenglishhub.com/',
                    'https://expressenglishhub.com/toefl-itp',
                    'https://expressenglishhub.com/toefl-ibt',
                    'https://expressenglishhub.com/products',
                    'https://expressenglishhub.com/blog'
                ];
                
                $siteAudit = [];
                foreach ($pages as $page) {
                    $siteAudit[$page] = analyzeSEO($page);
                }
                
                // Calculate average score
                $totalScore = array_sum(array_column($siteAudit, 'score'));
                $averageScore = count($siteAudit) > 0 ? $totalScore / count($siteAudit) : 0;
                
                echo json_encode([
                    'success' => true,
                    'site_audit' => $siteAudit,
                    'average_score' => round($averageScore, 1),
                    'total_pages' => count($siteAudit)
                ]);
                break;
                
            default:
                throw new Exception('Invalid action');
        }
        
    } else {
        // GET request - return SEO dashboard data
        if (!isAuthenticated()) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Authentication required']);
            exit;
        }
        
        // Get articles count
        $articlesDir = __DIR__ . '/../articles/';
        $articlesCount = is_dir($articlesDir) ? count(glob($articlesDir . '*.html')) : 0;
        
        // Basic site stats
        $stats = [
            'total_articles' => $articlesCount,
            'last_updated' => date('Y-m-d H:i:s'),
            'sitemap_urls' => 6 + $articlesCount, // Static pages + articles
            'avg_seo_score' => 75, // Placeholder - would be calculated from actual analysis
            'keywords_tracked' => 50 // Placeholder
        ];
        
        echo json_encode([
            'success' => true,
            'stats' => $stats
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>