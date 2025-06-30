
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Users, Search, Plus, FolderOpen, Images } from 'lucide-react';
import Navbar from '../components/Navbar';
import CreateGroupModal from '../components/CreateGroupModal';

interface Group {
  id: string;
  name: string;
  description: string;
  photoCount: number;
  coverPhoto?: string;
  createdAt: string;
}

const Home = () => {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Family Vacation 2024',
      description: 'Our amazing summer trip to the mountains',
      photoCount: 24,
      coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Birthday Party',
      description: 'Mom\'s surprise birthday celebration',
      photoCount: 18,
      coverPhoto: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Kids Activities',
      description: 'School events and sports',
      photoCount: 31,
      coverPhoto: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400',
      createdAt: '2024-01-25'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateGroup = (groupData: { name: string; description: string }) => {
    const newGroup: Group = {
      id: (groups.length + 1).toString(),
      ...groupData,
      photoCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGroups([newGroup, ...groups]);
    setShowCreateModal(false);
  };

  const totalPhotos = groups.reduce((total, group) => total + group.photoCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              KwicPic
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Organize your memories into beautiful albums with AI-powered face recognition
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{groups.length}</div>
              <div className="text-sm text-gray-600">Albums</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{totalPhotos}</div>
              <div className="text-sm text-gray-600">Photos</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Album</span>
          </button>
          
          <Link
            to="/search"
            className="inline-flex items-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg border border-gray-100"
          >
            <Search className="w-5 h-5" />
            <span>Search Photos</span>
          </Link>
        </div>

        {/* Groups Grid */}
        {groups.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Albums Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first album to start organizing your photos by events, people, or occasions.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
              <span>Create Album</span>
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Albums</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Link
                  key={group.id}
                  to={`/gallery/${group.id}`}
                  className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
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
                        <Images className="w-12 h-12 text-purple-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{group.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-600 font-medium">
                        {group.photoCount} photo{group.photoCount !== 1 ? 's' : ''}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGroup}
      />
    </div>
  );
};

export default Home;
