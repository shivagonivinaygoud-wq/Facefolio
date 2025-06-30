
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Image, Plus, FolderOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

interface Group {
  id: string;
  name: string;
  description: string;
  photoCount: number;
  coverPhoto?: string;
  createdAt: string;
  detectedPeople: string[];
}

const Gallery = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockGroups: Group[] = [
        {
          id: '1',
          name: 'Family Vacation 2024',
          description: 'Our amazing summer trip to the mountains',
          photoCount: 24,
          coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          createdAt: '2024-01-15',
          detectedPeople: ['Mom', 'Dad', 'Kids']
        },
        {
          id: '2',
          name: 'Birthday Party',
          description: 'Mom\'s surprise birthday celebration',
          photoCount: 18,
          coverPhoto: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
          createdAt: '2024-01-20',
          detectedPeople: ['Mom', 'Dad', 'Kids', 'Grandparents']
        },
        {
          id: '3',
          name: 'Kids Activities',
          description: 'School events and sports',
          photoCount: 31,
          coverPhoto: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400',
          createdAt: '2024-01-25',
          detectedPeople: ['Kids']
        }
      ];
      
      setGroups(mockGroups);
      setLoading(false);
    };

    fetchGroups();
  }, []);

  const totalPhotos = groups.reduce((total, group) => total + group.photoCount, 0);
  const allDetectedPeople = new Set(groups.flatMap(g => g.detectedPeople));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600">Loading your albums...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <FolderOpen className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600">{groups.length} Albums</span>
            </div>
            <div className="flex items-center space-x-2">
              <Image className="w-4 h-4 text-pink-500" />
              <span className="text-gray-600">{totalPhotos} Photos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">{allDetectedPeople.size} People</span>
            </div>
          </div>
        </div>

        {groups.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Albums Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first album to start organizing your photos by events, people, or occasions.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
              <span>Create Album</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Link
                key={group.id}
                to={`/gallery/${group.id}`}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in"
              >
                <div className="aspect-video overflow-hidden">
                  {group.coverPhoto ? (
                    <img
                      src={group.coverPhoto}
                      alt={group.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Image className="w-12 h-12 text-purple-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{group.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-600 font-medium">
                        {group.photoCount} photo{group.photoCount !== 1 ? 's' : ''}
                      </span>
                      <span className="text-gray-500">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {group.detectedPeople.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {group.detectedPeople.slice(0, 3).join(', ')}
                          {group.detectedPeople.length > 3 && ` +${group.detectedPeople.length - 3}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;
