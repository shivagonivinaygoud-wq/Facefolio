
import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import PhotoCard from '../components/PhotoCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface SearchResult {
  id: string;
  src: string;
  alt: string;
  personName: string;
  uploadDate: string;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock search data
  const mockPhotos: SearchResult[] = [
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1494790108755-2616b5b8ef3c?w=400',
      alt: 'Mom photo 1',
      personName: 'Mom',
      uploadDate: '2024-01-15'
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      alt: 'Mom photo 2',
      personName: 'Mom',
      uploadDate: '2024-01-20'
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      alt: 'Dad photo 1',
      personName: 'Dad',
      uploadDate: '2024-01-18'
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400',
      alt: 'Kids photo 1',
      personName: 'Kids',
      uploadDate: '2024-01-22'
    },
    {
      id: '5',
      src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      alt: 'Kids photo 2',
      personName: 'Kids',
      uploadDate: '2024-01-25'
    }
  ];

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Filter mock data based on search query
    const filteredResults = mockPhotos.filter(photo =>
      photo.personName.toLowerCase().includes(query.toLowerCase()) ||
      photo.alt.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredResults);
    setLoading(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  // Popular searches
  const popularSearches = ['Mom', 'Dad', 'Kids', 'Family'];

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    handleSearch(term);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
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
            Find photos by searching for family member names
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for family members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-full h-full" />
              </button>
            )}
          </div>
        </div>

        {/* Popular Searches */}
        {!hasSearched && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Searches</h2>
            <div className="flex flex-wrap gap-2">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    src={photo.src}
                    alt={photo.alt}
                    personName={photo.personName}
                    uploadDate={new Date(photo.uploadDate).toLocaleDateString()}
                    className="animate-fade-in"
                  />
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
              Enter a family member's name in the search bar above to find all their photos instantly.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
