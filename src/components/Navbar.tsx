
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Upload, Image, Search, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">KwicPic</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link 
              to="/upload" 
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>Upload</span>
            </Link>
            <Link 
              to="/gallery" 
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Image className="w-5 h-5" />
              <span>Gallery</span>
            </Link>
            <Link 
              to="/search" 
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="hidden sm:block text-sm font-medium">
                {user?.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-purple-600">
              <Home className="w-6 h-6" />
            </Link>
            <Link to="/upload" className="text-gray-600 hover:text-purple-600">
              <Upload className="w-6 h-6" />
            </Link>
            <Link to="/gallery" className="text-gray-600 hover:text-purple-600">
              <Image className="w-6 h-6" />
            </Link>
            <Link to="/search" className="text-gray-600 hover:text-purple-600">
              <Search className="w-6 h-6" />
            </Link>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
