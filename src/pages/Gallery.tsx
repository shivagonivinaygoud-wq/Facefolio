
import React, { useState, useEffect } from 'react';
import { Users, Calendar, Image } from 'lucide-react';
import Navbar from '../components/Navbar';
import PhotoCard from '../components/PhotoCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface FamilyGroup {
  id: string;
  name: string;
  photos: {
    id: string;
    src: string;
    alt: string;
    uploadDate: string;
  }[];
}

const Gallery = () => {
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Simulate API call to fetch family groups
  useEffect(() => {
    const fetchFamilyGroups = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - in a real app, this would come from your backend
      const mockGroups: FamilyGroup[] = [
        {
          id: '1',
          name: 'Mom',
          photos: [
            {
              id: '1',
              src: 'https://images.unsplash.com/photo-1494790108755-2616b5b8ef3c?w=400',
              alt: 'Mom photo 1',
              uploadDate: '2024-01-15'
            },
            {
              id: '2',
              src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
              alt: 'Mom photo 2',
              uploadDate: '2024-01-20'
            }
          ]
        },
        {
          id: '2',
          name: 'Dad',
          photos: [
            {
              id: '3',
              src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
              alt: 'Dad photo 1',
              uploadDate: '2024-01-18'
            }
          ]
        },
        {
          id: '3',
          name: 'Kids',
          photos: [
            {
              id: '4',
              src: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400',
              alt: 'Kids photo 1',
              uploadDate: '2024-01-22'
            },
            {
              id: '5',
              src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
              alt: 'Kids photo 2',
              uploadDate: '2024-01-25'
            },
            {
              id: '6',
              src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
              alt: 'Kids photo 3',
              uploadDate: '2024-01-28'
            }
          ]
        }
      ];
      
      setFamilyGroups(mockGroups);
      setLoading(false);
    };

    fetchFamilyGroups();
  }, []);

  const filteredGroups = selectedGroup 
    ? familyGroups.filter(group => group.id === selectedGroup)
    : familyGroups;

  const totalPhotos = familyGroups.reduce((total, group) => total + group.photos.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600">Loading your photo gallery...</p>
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
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600">{familyGroups.length} Family Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Image className="w-4 h-4 text-pink-500" />
              <span className="text-gray-600">{totalPhotos} Photos</span>
            </div>
          </div>
        </div>

        {familyGroups.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Image className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Photos Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start by uploading some photos to see them organized by family members here.
            </p>
            <a
              href="/upload"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform"
            >
              <span>Upload Photos</span>
            </a>
          </div>
        ) : (
          <>
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => setSelectedGroup(null)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedGroup === null
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-50'
                }`}
              >
                All ({totalPhotos})
              </button>
              {familyGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedGroup === group.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  {group.name} ({group.photos.length})
                </button>
              ))}
            </div>

            {/* Photo Groups */}
            <div className="space-y-12">
              {filteredGroups.map((group) => (
                <div key={group.id} className="animate-fade-in">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">{group.name}</h2>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      {group.photos.length} photo{group.photos.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {group.photos.map((photo) => (
                      <PhotoCard
                        key={photo.id}
                        src={photo.src}
                        alt={photo.alt}
                        uploadDate={new Date(photo.uploadDate).toLocaleDateString()}
                        className="animate-scale-in"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Gallery;
