import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Search, 
  Eye, 
  Target, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  ExternalLink,
  FileText,
  Globe,
  Zap
} from 'lucide-react';

const SEODashboard = () => {
  const [seoStats, setSeoStats] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeUrl, setAnalyzeUrl] = useState('');
  const [siteAudit, setSiteAudit] = useState(null);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  useEffect(() => {
    loadSEOStats();
  }, []);

  const loadSEOStats = async () => {
    try {
      const response = await fetch('/api/seo-analytics.php', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setSeoStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading SEO stats:', error);
    }
  };

  const analyzeURL = async () => {
    if (!analyzeUrl.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/seo-analytics.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'analyze_url',
          url: analyzeUrl
        })
      });

      const data = await response.json();
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error analyzing URL: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runSiteAudit = async () => {
    setIsLoadingAudit(true);
    try {
      const response = await fetch('/api/seo-analytics.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'site_audit'
        })
      });

      const data = await response.json();
      if (data.success) {
        setSiteAudit(data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error running site audit: ' + error.message);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const updateSitemap = async () => {
    try {
      const response = await fetch('/api/update-sitemap.php');
      const data = await response.json();
      
      if (data.success) {
        alert(`Sitemap updated successfully! ${data.total_urls} URLs indexed.`);
        loadSEOStats();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error updating sitemap: ' + error.message);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* SEO Stats Overview */}
      {seoStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Articles</h3>
                <p className="text-2xl font-bold text-blue-600">{seoStats.total_articles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Sitemap URLs</h3>
                <p className="text-2xl font-bold text-green-600">{seoStats.sitemap_urls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Avg SEO Score</h3>
                <p className={`text-2xl font-bold ${getScoreColor(seoStats.avg_seo_score)}`}>
                  {seoStats.avg_seo_score}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Keywords Tracked</h3>
                <p className="text-2xl font-bold text-orange-600">{seoStats.keywords_tracked}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={updateSitemap}
            className="flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Update Sitemap
          </button>

          <button
            onClick={runSiteAudit}
            disabled={isLoadingAudit}
            className="flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoadingAudit ? (
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Search className="h-5 w-5 mr-2" />
            )}
            {isLoadingAudit ? 'Running Audit...' : 'Run Site Audit'}
          </button>
        </div>
      </div>

      {/* URL Analyzer */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">URL SEO Analyzer</h3>
        <div className="flex gap-4">
          <input
            type="url"
            value={analyzeUrl}
            onChange={(e) => setAnalyzeUrl(e.target.value)}
            placeholder="Enter URL to analyze..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={analyzeURL}
            disabled={isAnalyzing || !analyzeUrl.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-2 inline" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">SEO Analysis Results</h3>
            <div className={`px-4 py-2 rounded-lg ${getScoreBg(analysis.score)}`}>
              <span className={`font-bold text-lg ${getScoreColor(analysis.score)}`}>
                Grade: {analysis.grade} ({analysis.score}%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Issues */}
            <div>
              <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Issues Found ({analysis.issues.length})
              </h4>
              <ul className="space-y-2">
                {analysis.issues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Recommendations ({analysis.recommendations.length})
              </h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Meta Analysis */}
          {analysis.meta_analysis && (
            <div className="mt-6 border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Meta Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.meta_analysis.title && (
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium text-gray-900">Title Tag</h5>
                    <p className="text-sm text-gray-600 mt-1">{analysis.meta_analysis.title.content}</p>
                    <div className="mt-2 flex items-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        analysis.meta_analysis.title.status === 'good' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {analysis.meta_analysis.title.length} characters
                      </span>
                    </div>
                  </div>
                )}

                {analysis.meta_analysis.description && (
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium text-gray-900">Meta Description</h5>
                    <p className="text-sm text-gray-600 mt-1">{analysis.meta_analysis.description.content}</p>
                    <div className="mt-2 flex items-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        analysis.meta_analysis.description.status === 'good' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {analysis.meta_analysis.description.length} characters
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Analysis */}
          {analysis.content_analysis && (
            <div className="mt-6 border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Content Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center border rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-600">{analysis.content_analysis.word_count}</p>
                  <p className="text-sm text-gray-600">Words</p>
                </div>
                
                <div className="text-center border rounded-lg p-4">
                  <p className="text-2xl font-bold text-green-600">{analysis.content_analysis.headings?.h1_count || 0}</p>
                  <p className="text-sm text-gray-600">H1 Tags</p>
                </div>
                
                <div className="text-center border rounded-lg p-4">
                  <p className="text-2xl font-bold text-purple-600">{analysis.content_analysis.images?.total_images || 0}</p>
                  <p className="text-sm text-gray-600">Images</p>
                </div>
                
                <div className="text-center border rounded-lg p-4">
                  <p className="text-2xl font-bold text-orange-600">{analysis.content_analysis.links?.internal_links || 0}</p>
                  <p className="text-sm text-gray-600">Internal Links</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Site Audit Results */}
      {siteAudit && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Site SEO Audit</h3>
            <div className={`px-4 py-2 rounded-lg ${getScoreBg(siteAudit.average_score)}`}>
              <span className={`font-bold text-lg ${getScoreColor(siteAudit.average_score)}`}>
                Average Score: {siteAudit.average_score}%
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(siteAudit.site_audit).map(([url, data]) => (
              <div key={url} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-900">{url.replace('https://expressenglishhub.com', '')}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(data.score)} ${getScoreColor(data.score)}`}>
                    {data.grade} ({data.score}%)
                  </span>
                </div>
                
                {data.issues.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-600 mb-1">Issues:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {data.issues.slice(0, 3).map((issue, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {issue}
                        </li>
                      ))}
                      {data.issues.length > 3 && (
                        <li className="text-gray-500">+{data.issues.length - 3} more issues</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SEODashboard;