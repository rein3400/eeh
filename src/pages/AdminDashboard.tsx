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
  RefreshCw
} from 'lucide-react';
import SEO from '../components/SEO';
import LoginForm from '../components/LoginForm';
import SEODashboard from '../components/SEODashboard';
import PluginManager from '../components/PluginManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [generatorForm, setGeneratorForm] = useState({
    keywords: '',
    count: 1,
    language: 'id'
  });

  const [user] = useState({
    name: 'Admin EEH',
    email: 'admin@expressenglishhub.com',
    avatar: '/logo.jpg'
  });

  // Check authentication on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth-check.php', {
        credentials: 'include'
      });
      const result = await response.json();
      
      if (result.success && result.authenticated) {
        setIsAuthenticated(true);
        setUserInfo(result);
        loadArticles(); // Load articles after authentication
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_session');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLoginSuccess = (userData: any) => {
    setIsAuthenticated(true);
    setUserInfo(userData);
    loadArticles();
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth-check.php', {
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem('admin_session');
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
    { id: 'seo', label: 'SEO Dashboard', icon: TrendingUp },
    { id: 'plugins', label: 'Plugin Manager', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Load articles from backend
  const loadArticles = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/articles.php', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.status === 401) {
        // Session expired
        setIsAuthenticated(false);
        localStorage.removeItem('admin_session');
        return;
      }
      
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  };

  const generateArticles = async () => {
    if (!generatorForm.keywords.trim()) {
      alert('Please enter keywords');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:8080/api/generate-article.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(generatorForm)
      });

      if (response.status === 401) {
        // Session expired
        setIsAuthenticated(false);
        localStorage.removeItem('admin_session');
        alert('Session expired. Please login again.');
        return;
      }

      const result = await response.json();
      if (result.success) {
        alert(`Successfully generated ${result.count} articles!`);
        loadArticles();
        setGeneratorForm({ keywords: '', count: 1, language: 'id' });
      } else {
        alert('Error generating articles: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteArticle = async (filename) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch('/api/delete-article.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ filename })
        });

        if (response.status === 401) {
          // Session expired
          setIsAuthenticated(false);
          localStorage.removeItem('admin_session');
          alert('Session expired. Please login again.');
          return;
        }

        const result = await response.json();
        if (result.success) {
          loadArticles();
        } else {
          alert('Error deleting article: ' + result.error);
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
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
      case 'seo':
        return <SEODashboard />;
      case 'plugins':
        return <PluginManager />;
      case 'settings':
        return <div className="bg-white rounded-lg shadow-sm p-6"><h3 className="text-lg font-semibold">Settings</h3><p className="text-gray-600 mt-2">Settings panel for blog management and configuration.</p></div>;
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