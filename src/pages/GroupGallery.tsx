
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Users, Image, Share2, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import PhotoCard from '../components/PhotoCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface Photo {
  id: string;
  src: string;
  alt: string;
  uploadDate: string;
  detectedFaces?: string[];
}

interface Group {
  id: string;
  name: string;
  description: string;
  photos: Photo[];
  createdAt: string;
}

const GroupGallery = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock group data
      const mockGroup: Group = {
        id: groupId || '1',
        name: groupId === '1' ? 'Family Vacation 2024' : 
              groupId === '2' ? 'Birthday Party' : 'Kids Activities',
        description: groupId === '1' ? 'Our amazing summer trip to the mountains' :
                    groupId === '2' ? 'Mom\'s surprise birthday celebration' : 'School events and sports',
        createdAt: '2024-01-15',
        photos: [
          {
            id: '1',
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            alt: 'Mountain landscape',
            uploadDate: '2024-01-15',
            detectedFaces: ['Mom', 'Dad']
          },
          {
            id: '2',
            src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
            alt: 'Family celebration',
            uploadDate: '2024-01-16',
            detectedFaces: ['Kids', 'Mom']
          },
          {
            id: '3',
            src: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400',
            alt: 'Kids playing',
            uploadDate: '2024-01-17',
            detectedFaces: ['Kids']
          },
          {
            id: '4',
            src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            alt: 'Family portrait',
            uploadDate: '2024-01-18',
            detectedFaces: ['Mom', 'Dad', 'Kids']
          }
        ]
      };
      
      setGroup(mockGroup);
      setLoading(false);
    };

    if (groupId) {
      fetchGroup();
    }
  }, [groupId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600">Loading album...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Album Not Found</h1>
          <Link to="/" className="text-purple-600 hover:text-purple-700">
            Back to Albums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Albums</span>
          </Link>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
                <p className="text-gray-600 mb-4">{group.description}</p>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Image className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600">{group.photos.length} Photos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-pink-500" />
                    <span className="text-gray-600">
                      {new Set(group.photos.flatMap(p => p.detectedFaces || [])).size} People Detected
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link
                  to={`/upload/${group.id}`}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:scale-105 transition-transform"
                >
                  <Upload className="w-4 h-4" />
                  <span>Add Photos</span>
                </Link>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        {group.photos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Image className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Photos Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start by uploading some photos to this album.
            </p>
            <Link
              to={`/upload/${group.id}`}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Photos</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {group.photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <PhotoCard
                  src={photo.src}
                  alt={photo.alt}
                  uploadDate={new Date(photo.uploadDate).toLocaleDateString()}
                  className="animate-scale-in"
                />
                
                {/* Face Detection Overlay */}
                {photo.detectedFaces && photo.detectedFaces.length > 0 && (
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                      <p className="text-white text-xs">
                        {photo.detectedFaces.join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default GroupGallery;
