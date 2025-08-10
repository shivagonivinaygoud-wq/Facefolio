import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, User, Clock, FolderOpen, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import PhotoCard from '../components/PhotoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PhotoLightbox from '../components/PhotoLightbox';
import { useGroups } from '@/hooks/useGroups';

interface SearchResult {
  id: string;
  src: string;
  alt: string;
  personName: string;
  uploadDate: string;
  groupName: string;
  groupId: string;
  detectedFaces?: string[];
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [searchType, setSearchType] = useState<'name' | 'phone'>('name');
  
  const { data: groups = [] } = useGroups();
  
  // Mock members data for demo - replace with actual member data
  const mockMembers = [
    { id: '1', name: 'Sarah Johnson', phoneNumber: '+1234567890', profilePicture: '' },
    { id: '2', name: 'Mike Johnson', phoneNumber: '+1234567891', profilePicture: '' },
    { id: '3', name: 'Emma Johnson', phoneNumber: '+1234567892', profilePicture: '' },
    { id: '4', name: 'Alex Johnson', phoneNumber: '+1234567893', profilePicture: '' }
  ];

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Enhanced mock search results with more realistic data
      const allPhotos: SearchResult[] = [
        { 
          id: '1', 
          src: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400', 
          alt: 'Family Photo 1', 
          personName: 'Sarah Johnson', 
          uploadDate: '2024-01-15', 
          groupName: 'Family Vacation',
          groupId: 'group1',
          detectedFaces: ['Sarah Johnson', 'Mike Johnson']
        },
        { 
          id: '2', 
          src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 
          alt: 'Family Photo 2', 
          personName: 'Mike Johnson', 
          uploadDate: '2024-01-16', 
          groupName: 'Family Vacation',
          groupId: 'group1',
          detectedFaces: ['Mike Johnson', 'Emma Johnson']
        },
        { 
          id: '3', 
          src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', 
          alt: 'Birthday Photo 1', 
          personName: 'Sarah Johnson', 
          uploadDate: '2024-01-20', 
          groupName: 'Birthday Party',
          groupId: 'group2',
          detectedFaces: ['Sarah Johnson', 'Emma Johnson', 'Alex Johnson']
        },
        { 
          id: '4', 
          src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 
          alt: 'Birthday Photo 2', 
          personName: 'Mike Johnson', 
          uploadDate: '2024-01-20', 
          groupName: 'Birthday Party',
          groupId: 'group2',
          detectedFaces: ['Mike Johnson', 'Sarah Johnson']
        },
        { 
          id: '5', 
          src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 
          alt: 'Kids Photo 1', 
          personName: 'Emma Johnson', 
          uploadDate: '2024-01-25', 
          groupName: 'Kids Activities',
          groupId: 'group3',
          detectedFaces: ['Emma Johnson', 'Alex Johnson']
        },
        { 
          id: '6', 
          src: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400', 
          alt: 'Kids Photo 2', 
          personName: 'Alex Johnson', 
          uploadDate: '2024-01-26', 
          groupName: 'Kids Activities',
          groupId: 'group3',
          detectedFaces: ['Alex Johnson']
        },
      ];
      
      let filtered: SearchResult[] = [];
      
      if (searchType === 'name') {
        filtered = allPhotos.filter(photo => 
          photo.personName.toLowerCase().includes(query.toLowerCase()) ||
          photo.detectedFaces?.some(face => face.toLowerCase().includes(query.toLowerCase()))
        );
      } else {
        // Search by phone number 
        const memberWithPhone = mockMembers.find(member => 
          member.phoneNumber?.includes(query)
        );
        if (memberWithPhone) {
          filtered = allPhotos.filter(photo => 
            photo.personName.toLowerCase().includes(memberWithPhone.name.toLowerCase()) ||
            photo.detectedFaces?.some(face => face.toLowerCase().includes(memberWithPhone.name.toLowerCase()))
          );
        }
      }
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % searchResults.length);
  };

  const previousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
  };

  // Popular searches based on detected people from groups
  const popularSearches = [
    'Sarah Johnson', 
    'Mike Johnson', 
    'Emma Johnson', 
    'Alex Johnson'
  ];
  
  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    handleSearch(term);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Photos</h1>
          <p className="text-lg text-gray-600">
            Find photos by searching for people by name or phone number
          </p>
        </div>

        {/* Search Type Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setSearchType('name')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchType === 'name'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Search by Name</span>
              </div>
            </button>
            <button
              onClick={() => setSearchType('phone')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchType === 'phone'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Search by Phone</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'name' 
                  ? "Search for people by name..." 
                  : "Search by phone number..."
              }
              className="w-full pl-12 pr-12 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Popular Searches */}
        {!hasSearched && searchType === 'name' && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Popular Searches</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularSearch(term)}
                  className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-colors border border-gray-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600">Searching your photos...</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!loading && hasSearched && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Search Results
              </h2>
              <p className="text-gray-600">
                {searchResults.length === 0 
                  ? `No photos found for "${searchQuery}"`
                  : `Found ${searchResults.length} photo${searchResults.length > 1 ? 's' : ''} for "${searchQuery}"`
                }
              </p>
            </div>

            {searchResults.length === 0 ? (
              /* No Results */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos found</h3>
                <p className="text-gray-600 mb-6">
                  Try searching with different keywords or check the spelling.
                </p>
                <button
                  onClick={clearSearch}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear search and try again
                </button>
              </div>
            ) : (
              /* Results Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((result, index) => (
                  <div
                    key={result.id}
                    onClick={() => openLightbox(index)}
                    className="cursor-pointer hover:scale-105 transition-transform"
                  >
                    <PhotoCard
                      src={result.src}
                      alt={result.alt}
                      personName={result.personName}
                      uploadDate={new Date(result.uploadDate).toLocaleDateString()}
                    />
                    <div className="mt-2 text-center">
                      <p className="text-sm text-gray-600 flex items-center justify-center space-x-1">
                        <FolderOpen className="w-3 h-3" />
                        <span>{result.groupName}</span>
                      </p>
                      {result.detectedFaces && result.detectedFaces.length > 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          +{result.detectedFaces.length - 1} other{result.detectedFaces.length > 2 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Start searching your photos
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a person's name or phone number in the search bar above to find all their photos instantly.
            </p>
          </div>
        )}
      </main>

      <PhotoLightbox
        isOpen={lightboxOpen}
        photos={searchResults.map(result => ({
          id: result.id,
          src: result.src,
          alt: result.alt,
          uploadDate: result.uploadDate,
          detectedFaces: result.detectedFaces
        }))}
        currentIndex={currentPhotoIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={nextPhoto}
        onPrevious={previousPhoto}
        members={mockMembers}
      />
    </div>
  );
};

export default Search;