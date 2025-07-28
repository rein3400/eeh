import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  BookOpen,
  MessageCircle,
  Calendar,
  Upload,
  Search,
  Bell,
  User,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Activity,
  TrendingUp,
  UserCheck,
  Mail,
  Phone,
  Globe,
  Target,
  Award,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Shield
} from 'lucide-react';
import SEO from '../components/SEO';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [config, setConfig] = useState({
    openrouter_model: '',
    openrouter_api_key: ''
  });
  const [generatorForm, setGeneratorForm] = useState({
    keywords: '',
    count: 1,
    language: 'id'
  });

  // Get backend URL from environment
  const getBackendUrl = () => {
    return process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
  };

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('admin_token');
  };

  // Set auth headers
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);
    try {
      const token = getAuthToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        return;
      }

      const response = await fetch(`${getBackendUrl()}/api/auth-check`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.authenticated) {
          setIsAuthenticated(true);
          setUserInfo(result);
          loadArticles();
          loadConfig();
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('admin_token');
        }
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('admin_token', userData.token);
    setIsAuthenticated(true);
    setUserInfo(userData);
    loadArticles();
    loadConfig();
  };

  const handleLogout = async () => {
    try {
      await fetch(`${getBackendUrl()}/api/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      localStorage.removeItem('admin_token');
      setIsAuthenticated(false);
      setUserInfo(null);
      setArticles([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const sidebarItems = [
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'generator', label: 'Blog Generator', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Load articles from backend
  const loadArticles = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/articles`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setArticles(result.articles || []);
        }
      }
    } catch (error) {
      console.error('Load articles error:', error);
    }
  };

  // Load configuration
  const loadConfig = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/config`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setConfig(result.config || {});
        }
      }
    } catch (error) {
      console.error('Load config error:', error);
    }
  };

  // Generate article
  const generateArticles = async () => {
    if (!generatorForm.keywords.trim()) {
      alert('Please enter keywords');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${getBackendUrl()}/api/generate-article`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          keywords: generatorForm.keywords,
          count: generatorForm.count,
          language: generatorForm.language
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert(`Successfully generated ${result.count} article(s)!`);
          setGeneratorForm({ keywords: '', count: 1, language: 'id' });
          loadArticles(); // Reload articles list
        } else {
          throw new Error(result.error || 'Generation failed');
        }
      } else {
        const errorResult = await response.json();
        throw new Error(errorResult.detail || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Delete article
  const deleteArticle = async (filename) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`${getBackendUrl()}/api/delete-article?filename=${encodeURIComponent(filename)}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            alert('Article deleted successfully!');
            loadArticles(); // Reload articles list
          } else {
            throw new Error(result.error || 'Delete failed');
          }
        } else {
          const errorResult = await response.json();
          throw new Error(errorResult.detail || 'Delete failed');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert(`Delete failed: ${error.message}`);
      }
    }
  };

  // Update configuration
  const updateConfig = async (newConfig) => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/config`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newConfig)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('Configuration updated successfully!');
          loadConfig(); // Reload config
        } else {
          throw new Error(result.error || 'Update failed');
        }
      } else {
        const errorResult = await response.json();
        throw new Error(errorResult.detail || 'Update failed');
      }
    } catch (error) {
      console.error('Update config error:', error);
      alert(`Update failed: ${error.message}`);
    }
  };

  const renderArticles = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Articles Management</h3>
          <button
            onClick={() => setActiveTab('generator')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate New Articles
          </button>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">
              Start by generating some articles using the AI blog generator
            </p>
            <button
              onClick={() => setActiveTab('generator')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Generate Articles
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {articles.map((article, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.filename}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.created}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <a
                        href={`/articles/${article.filename}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4 inline" />
                      </a>
                      <button
                        onClick={() => deleteArticle(article.filename)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderBlogGenerator = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">AI Blog Generator</h3>
        <p className="text-gray-600 mb-6">
          Generate high-quality articles using Google Gemini 2.5 Flash. Enter keywords and specify how many articles you want to generate.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords (separated by commas)
            </label>
            <input
              type="text"
              value={generatorForm.keywords}
              onChange={(e) => setGeneratorForm({...generatorForm, keywords: e.target.value})}
              placeholder="e.g., TOEFL preparation, English learning, study tips"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isGenerating}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Articles
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={generatorForm.count}
                onChange={(e) => setGeneratorForm({...generatorForm, count: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isGenerating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={generatorForm.language}
                onChange={(e) => setGeneratorForm({...generatorForm, language: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isGenerating}
              >
                <option value="id">Indonesian</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateArticles}
            disabled={isGenerating || !generatorForm.keywords.trim()}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                Generating Articles...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Generate Articles
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent Generated Articles */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Articles</h4>
        {articles.slice(0, 5).map((article, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
            <div>
              <h5 className="font-medium text-gray-900">{article.title}</h5>
              <p className="text-sm text-gray-500">{article.filename}</p>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={`/articles/${article.filename}`}
                target="_blank"
                className="text-blue-600 hover:text-blue-800"
              >
                <Eye className="h-4 w-4" />
              </a>
              <button
                onClick={() => deleteArticle(article.filename)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'articles':
        return renderArticles();
      case 'generator':
        return renderBlogGenerator();
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Configuration Settings</h2>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">OpenRouter API Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Model
                    </label>
                    <input
                      type="text"
                      value={config.openrouter_model || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, openrouter_model: e.target.value }))}
                      placeholder="e.g., google/gemini-2.5-flash"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key (masked)
                    </label>
                    <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      {config.openrouter_api_key || 'Not set'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update API Key
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new API key (leave blank to keep current)"
                      onChange={(e) => setConfig(prev => ({ ...prev, new_api_key: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={() => updateConfig({
                      openrouter_model: config.openrouter_model,
                      ...(config.new_api_key && { openrouter_api_key: config.new_api_key })
                    })}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Update Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderArticles();
    }
  };

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e97311] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <SEO 
        title="EEH Admin - Express English Hub Admin Dashboard"
        description="Admin dashboard untuk mengelola platform Express English Hub TOEFL preparation."
        keywords="admin dashboard, TOEFL management, student management, course analytics"
        url="/eeh-admin"
      />
      
      <div className="min-h-screen bg-gray-100">
        {/* Top Admin Bar - WordPress Style */}
        <div className="bg-gray-800 text-white">
          <div className="max-w-full mx-auto px-4">
            <div className="flex items-center justify-between h-8 text-sm">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Express English Hub</span>
                <a href="/" className="hover:text-blue-300">Visit Site</a>
              </div>
              <div className="flex items-center space-x-4">
                <Bell className="h-4 w-4" />
                <span>Howdy, {userInfo?.username || user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="hover:text-red-300 flex items-center"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* WordPress-style Sidebar */}
          <div className="w-64 bg-white shadow-sm min-h-screen">
            {/* Logo Area */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img src="/logo.jpg" alt="EEH" className="w-8 h-8 rounded" />
                <div>
                  <h2 className="font-bold text-gray-900">Express English Hub</h2>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-6">
              <ul className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                          activeTab === item.id ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Collapse Button */}
            <div className="absolute bottom-4 left-4">
              <button className="text-gray-400 hover:text-gray-600">
                <span className="text-xs">Collapse menu</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
              <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                    </h1>
                    <p className="text-gray-600">Manage your TOEFL preparation platform</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      New
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;