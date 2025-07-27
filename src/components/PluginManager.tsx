import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Package, 
  Power, 
  PowerOff, 
  Trash2, 
  Download,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plug,
  Code,
  User,
  Globe,
  Settings
} from 'lucide-react';

const PluginManager = () => {
  const [plugins, setPlugins] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = async () => {
    try {
      const response = await fetch('/api/plugin-manager.php', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setPlugins(data.plugins);
      }
    } catch (error) {
      console.error('Error loading plugins:', error);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/zip') {
      alert('Please select a valid ZIP file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('plugin_zip', file);
    formData.append('action', 'upload');

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            alert('Plugin uploaded successfully!');
            loadPlugins();
          } else {
            alert('Error: ' + response.error);
          }
        } else {
          alert('Upload failed');
        }
        setIsUploading(false);
        setUploadProgress(0);
      };

      xhr.onerror = () => {
        alert('Upload failed');
        setIsUploading(false);
        setUploadProgress(0);
      };

      xhr.open('POST', '/api/plugin-manager.php');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send(formData);

    } catch (error) {
      alert('Error uploading plugin: ' + error.message);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const togglePlugin = async (pluginName, isActive) => {
    try {
      const action = isActive ? 'deactivate' : 'activate';
      const response = await fetch('/api/plugin-manager.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: action,
          plugin_name: pluginName
        })
      });

      const data = await response.json();
      if (data.success) {
        loadPlugins();
        alert(data.message);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const deletePlugin = async (pluginName) => {
    if (!confirm(`Are you sure you want to delete the plugin "${pluginName}"?`)) {
      return;
    }

    try {
      const response = await fetch('/api/plugin-manager.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          plugin_name: pluginName
        })
      });

      const data = await response.json();
      if (data.success) {
        loadPlugins();
        alert(data.message);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const zipFile = files.find(file => file.type === 'application/zip');
    
    if (zipFile) {
      handleFileUpload(zipFile);
    } else {
      alert('Please drop a ZIP file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const executeHook = async (hook, data = null) => {
    try {
      const response = await fetch('/api/plugin-manager.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'execute_hook',
          hook: hook,
          data: data
        })
      });

      const result = await response.json();
      if (result.success) {
        console.log('Hook results:', result.results);
        alert(`Hook "${hook}" executed successfully!`);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error executing hook: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Plugin</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <div className="space-y-4">
              <RefreshCw className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
              <div>
                <p className="text-lg font-medium text-gray-900">Uploading Plugin...</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{Math.round(uploadProgress)}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop your plugin ZIP file here
                </p>
                <p className="text-gray-600">or</p>
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                  <input
                    type="file"
                    accept=".zip"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Only ZIP files are accepted. Maximum file size: 10MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Plugin Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Plugins</h3>
              <p className="text-2xl font-bold text-blue-600">{plugins.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Plugins</h3>
              <p className="text-2xl font-bold text-green-600">
                {plugins.filter(p => p.active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Inactive Plugins</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {plugins.filter(p => !p.active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plugin List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Installed Plugins</h3>
          <button
            onClick={loadPlugins}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {plugins.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No plugins installed</h3>
            <p className="text-gray-600 mb-4">
              Upload your first WordPress-compatible plugin to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {plugins.map((plugin) => (
              <div key={plugin.name} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${plugin.active ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Plug className={`h-6 w-6 ${plugin.active ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {plugin.info.name || plugin.name}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plugin.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {plugin.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {plugin.info.description && (
                        <p className="text-gray-600 mb-2">{plugin.info.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {plugin.info.version && (
                          <span className="flex items-center">
                            <Code className="h-4 w-4 mr-1" />
                            Version {plugin.info.version}
                          </span>
                        )}
                        {plugin.info.author && (
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {plugin.info.author}
                          </span>
                        )}
                        {plugin.info.plugin_uri && (
                          <a 
                            href={plugin.info.plugin_uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <Globe className="h-4 w-4 mr-1" />
                            Plugin URI
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => togglePlugin(plugin.name, plugin.active)}
                      className={`flex items-center px-3 py-2 rounded-lg font-medium ${
                        plugin.active
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {plugin.active ? (
                        <>
                          <PowerOff className="h-4 w-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => deletePlugin(plugin.name)}
                      className="flex items-center px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plugin Hooks Testing */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plugin Hooks Testing</h3>
        <p className="text-gray-600 mb-4">
          Test custom hooks with your active plugins. Common hooks include article generation, SEO optimization, and content filtering.
        </p>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => executeHook('before_article_generate')}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            before_article_generate
          </button>
          <button
            onClick={() => executeHook('after_article_generate')}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
          >
            after_article_generate
          </button>
          <button
            onClick={() => executeHook('seo_optimize')}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
          >
            seo_optimize
          </button>
          <button
            onClick={() => executeHook('custom_function')}
            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
          >
            custom_function
          </button>
        </div>
      </div>
    </div>
  );
};

export default PluginManager;