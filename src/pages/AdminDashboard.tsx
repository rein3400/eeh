import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Settings, 
  BookOpen,
  Search,
  Bell,
  User,
  Plus,
  Trash2,
  Globe,
  RefreshCw,
  Shield,
  Eye,
  Users,
  Upload,
  Clock,
  ChevronLeft,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface Article {
  title: string;
  filename: string;
  created: string;
}

import SEO from '../components/SEO';
import SEODashboard from '../components/SEODashboard';
import PluginManager from '../components/PluginManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorForm, setGeneratorForm] = useState({
    keywords: '',
    count: 1,
    language: 'id'
  });

  const [user] = useState({
    name: 'Admin EEH',
    email: 'admin@toeflprep.com',
    avatar: '/logo.jpg'
  });

  // Load articles when component mounts
  useEffect(() => {
    loadArticles();
  }, []);

  const sidebarItems = [
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'generator', label: 'Blog Generator', icon: Plus },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'seo', label: 'SEO Dashboard', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },

    { id: 'plugins', label: 'Plugin Manager', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Load articles from backend
  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles.php');
      const data = await response.json();
      
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
      const response = await fetch('/api/generate-article.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generatorForm)
      });

      const result = await response.json();
      if (result.success) {
        alert(`Successfully generated ${result.count} articles!`);
        loadArticles();
        setGeneratorForm({ keywords: '', count: 1, language: 'id' });
      } else {
        alert('Error generating articles: ' + result.error);
      }
    } catch (error) {
      console.error('Error generating articles:', error);
      alert('Error generating articles. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteArticle = async (filename: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch('/api/delete-article.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filename })
        });

          const result = await response.json();
        if (result.success) {
          loadArticles();
        } else {
          alert('Error deleting article: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Error deleting article. Please try again.');
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Analytics Cards */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-gray-500 text-sm font-medium">Total Articles</h4>
            <FileText className="h-5 w-5 text-[#e97311]" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-gray-500 text-sm font-medium">Total Views</h4>
            <Eye className="h-5 w-5 text-[#e97311]" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">24.5K</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-gray-500 text-sm font-medium">Active Users</h4>
            <Users className="h-5 w-5 text-[#e97311]" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">1,203</p>
              <p className="text-sm text-green-600">+18% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-gray-500 text-sm font-medium">Avg. Time</h4>
            <Clock className="h-5 w-5 text-[#e97311]" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">4m 32s</p>
              <p className="text-sm text-green-600">+5% from last month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h4 className="text-lg font-semibold mb-4">Popular Articles</h4>
          <div className="space-y-4">
            {articles.slice(0, 5).map((article, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                  <h5 className="font-medium text-gray-900 truncate max-w-md">{article.title}</h5>
                </div>
                <span className="text-sm text-gray-500">{Math.floor(Math.random() * 1000)} views</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 py-2 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Plus className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">New article generated</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 py-2 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 py-2 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Article deleted</p>
                <p className="text-xs text-gray-500">45 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'articles':
        return renderArticles();
      case 'generator':
        return renderBlogGenerator();
      case 'analytics':
        return renderAnalytics();
      case 'seo':
        return <SEODashboard />;

      case 'plugins':
        return <PluginManager />;
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
                  <input type="text" defaultValue="Express English Hub" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e97311] focus:border-[#e97311]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                  <textarea defaultValue="TOEFL preparation platform with AI-powered content generation" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e97311] focus:border-[#e97311]" rows={3} />
                </div>
                <button className="bg-[#e97311] text-white px-6 py-2 rounded-lg hover:bg-[#d4640e] transition-colors">Save Changes</button>
              </div>
            </div>
          </div>
        );
      default:
        return renderArticles();
    }
  };

  return (
    <>
      <SEO 
        title="EEH Admin - Express English Hub Admin Dashboard | Kursus TOEFL Indonesia"
        description="Admin dashboard untuk mengelola platform Express English Hub TOEFL preparation. Kursus TOEFL ITP & iBT terbaik, manajemen artikel, dan analitik lengkap."
        keywords="admin dashboard, TOEFL management, student management, course analytics, kursus TOEFL, TOEFL ITP, TOEFL iBT, platform TOEFL Indonesia"
        url="/eeh-admin"
      />
      
      <div className="min-h-screen bg-gray-100">
        {/* Top Admin Bar - WordPress Style */}
        <div className="bg-[#e97311] text-white">
          <div className="max-w-full mx-auto px-4">
            <div className="flex items-center justify-between h-12 text-sm">
              <div className="flex items-center space-x-6">
                <span className="font-medium text-base">Express English Hub</span>
                <a href="/" className="hover:text-white/80 flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span>Visit Site</span>
                </a>
                <a href="/blog" className="hover:text-white/80 flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Blog</span>
                </a>
              </div>
              <div className="flex items-center space-x-6">
                <button className="hover:text-white/80 flex items-center space-x-1">
                  <Bell className="h-4 w-4" />
                  <span className="bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                </button>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Howdy, {user.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* WordPress-style Sidebar */}
          <div className="w-64 bg-white shadow-sm min-h-screen">
            {/* Logo Area */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-[#e97311] to-[#ed8936]">
              <div className="flex items-center space-x-3">
                <img src="/logo.jpg" alt="Express English Hub - Kursus TOEFL, Admin Dashboard" className="w-12 h-12 rounded-lg shadow-lg" />
                <div>
                  <h2 className="font-bold text-white text-lg">Express English Hub</h2>
                  <p className="text-xs text-white/80">Admin Control Panel</p>
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
                        className={`w-full flex items-center px-6 py-3 text-left hover:bg-orange-50 hover:text-[#e97311] transition-colors ${
                          activeTab === item.id ? 'bg-orange-50 text-[#e97311] border-r-4 border-[#e97311]' : 'text-gray-700'
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
              <button className="flex items-center space-x-2 text-gray-400 hover:text-[#e97311] transition-colors">
                <ChevronLeft className="h-4 w-4" />
                <span className="text-xs font-medium">Collapse menu</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
              <div className="px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      {sidebarItems.find(item => item.id === activeTab)?.icon && 
                        React.createElement(sidebarItems.find(item => item.id === activeTab)?.icon as any, { 
                          className: "h-6 w-6 text-[#e97311]" 
                        })
                      }
                      <h1 className="text-2xl font-bold text-gray-900">
                        {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                      </h1>
                    </div>
                    <p className="text-gray-600">Manage your TOEFL preparation platform and content</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search in admin..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e97311] focus:border-[#e97311] w-64"
                      />
                    </div>
                    <button className="bg-[#e97311] text-white px-4 py-2 rounded-lg hover:bg-[#d4640e] flex items-center space-x-2 transition-colors">
                      <Plus className="h-4 w-4" />
                      <span>Create New</span>
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