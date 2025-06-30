
import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Users, Search, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
  const features = [
    {
      icon: Upload,
      title: 'Smart Upload',
      description: 'Drag and drop your photos with instant preview and progress tracking'
    },
    {
      icon: Users,
      title: 'Face Recognition',
      description: 'Automatically organize photos by family members and friends'
    },
    {
      icon: Search,
      title: 'Quick Search',
      description: 'Find any photo instantly by searching for people or events'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">AI-Powered Photo Management</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize Your
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Family Memories
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload, organize, and search through your photo collection with intelligent face recognition 
            and seamless family grouping.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Upload className="w-5 h-5" />
              <span>Start Uploading</span>
            </Link>
            
            <Link
              to="/gallery"
              className="inline-flex items-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg border border-gray-100"
            >
              <span>View Gallery</span>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/80 transition-all duration-300 border border-white/50"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Sample Gallery Preview */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            See Your Photos Come to Life
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
