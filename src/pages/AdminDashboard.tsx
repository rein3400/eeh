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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
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

  // Mock data
  const [dashboardStats] = useState({
    totalUsers: 1247,
    totalCourses: 15,
    totalRevenue: 'Rp 185,750,000',
    activeStudents: 892,
    completionRate: '87%',
    avgScore: 485
  });

  const [recentUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@email.com', course: 'TOEFL ITP', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@email.com', course: 'TOEFL iBT', status: 'Active', joinDate: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@email.com', course: 'TOEFL ITP', status: 'Inactive', joinDate: '2024-01-13' },
    { id: 4, name: 'Alice Brown', email: 'alice@email.com', course: 'TOEFL iBT', status: 'Active', joinDate: '2024-01-12' }
  ]);

  const sidebarItems = [
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'generator', label: 'Blog Generator', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
        <p className="text-gray-600">Here's what's happening with your TOEFL platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.activeStudents.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalRevenue}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+15% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.completionRate}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+3% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg TOEFL Score</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.avgScore}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+25 points from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalCourses}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Plus className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm text-blue-600">2 new courses this month</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Course
            </button>
            <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Manage Users
            </button>
            <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              View Analytics
            </button>
            <button className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 flex items-center justify-center">
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.course}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'courses':
        return <div className="bg-white rounded-lg shadow-sm p-6"><h3 className="text-lg font-semibold">Courses Management</h3><p className="text-gray-600 mt-2">Course management interface coming soon...</p></div>;
      case 'posts':
        return <div className="bg-white rounded-lg shadow-sm p-6"><h3 className="text-lg font-semibold">Posts Management</h3><p className="text-gray-600 mt-2">Blog posts management interface coming soon...</p></div>;
      case 'analytics':
        return <div className="bg-white rounded-lg shadow-sm p-6"><h3 className="text-lg font-semibold">Analytics Dashboard</h3><p className="text-gray-600 mt-2">Advanced analytics dashboard coming soon...</p></div>;
      case 'messages':
        return <div className="bg-white rounded-lg shadow-sm p-6"><h3 className="text-lg font-semibold">Messages</h3><p className="text-gray-600 mt-2">Message management interface coming soon...</p></div>;
      case 'settings':
        return <div className="bg-white rounded-lg shadow-sm p-6"><h3 className="text-lg font-semibold">Settings</h3><p className="text-gray-600 mt-2">Settings panel coming soon...</p></div>;
      default:
        return renderDashboard();
    }
  };

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
                <span>Howdy, {user.name}</span>
                <button className="hover:text-red-300">
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