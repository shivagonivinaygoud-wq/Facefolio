
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { compreFaceService } from '@/services/compreface';

const CompreFaceConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('http://localhost:8000');

  const handleSave = () => {
    if (apiKey.trim()) {
      compreFaceService.updateApiKey(apiKey.trim());
      compreFaceService.updateBaseUrl(baseUrl.trim());
      localStorage.setItem('compreface_api_key', apiKey.trim());
      localStorage.setItem('compreface_base_url', baseUrl.trim());
      setIsOpen(false);
      alert('CompreFace configuration updated!');
    }
  };

  // Load saved configuration on component mount
  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('compreface_api_key');
    const savedBaseUrl = localStorage.getItem('compreface_base_url');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      compreFaceService.updateApiKey(savedApiKey);
    }
    if (savedBaseUrl) {
      setBaseUrl(savedBaseUrl);
      compreFaceService.updateBaseUrl(savedBaseUrl);
    }
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
        title="Configure CompreFace"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">CompreFace Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base URL
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="http://localhost:8000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your CompreFace API key"
            />
          </div>
          
          <div className="text-sm text-gray-600">
            <p>1. Start CompreFace: <code>docker-compose up -d</code></p>
            <p>2. Open <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">http://localhost:8080</a></p>
            <p>3. Create an application and face detection service</p>
            <p>4. Copy the API key here</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompreFaceConfig;
