
import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Upload as UploadIcon, X, Check, Users, ArrowLeft, FolderOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import GroupSelector from '../components/GroupSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import { useGroups } from '@/hooks/useGroups';
import { useUploadPhoto } from '@/hooks/usePhotos';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  faces?: number;
}

const Upload = () => {
  const { groupId } = useParams();
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groupId || '');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const { data: groups = [] } = useGroups();
  const uploadPhotoMutation = useUploadPhoto();

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    if (!selectedGroupId) {
      alert('Please select an album first');
      return;
    }

    for (const file of files) {
      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      
      const newFile: UploadedFile = {
        id,
        file,
        preview,
        progress: 0,
        status: 'uploading'
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      
      try {
        await uploadPhotoMutation.mutateAsync({ file, groupId: selectedGroupId });
        
        setUploadedFiles(prev => prev.map(f => 
          f.id === id 
            ? { 
                ...f, 
                progress: 100, 
                status: 'completed' as const,
                faces: Math.floor(Math.random() * 4) + 1
              }
            : f
        ));
      } catch (error) {
        setUploadedFiles(prev => prev.map(f => 
          f.id === id ? { ...f, status: 'error' as const } : f
        ));
      }
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Albums</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Photos</h1>
            <p className="text-lg text-gray-600">
              Add photos to your album with drag and drop
            </p>
          </div>
        </div>

        {/* Group Selection */}
        <div className="mb-8">
          <GroupSelector
            groups={groups}
            selectedGroupId={selectedGroupId}
            onGroupSelect={setSelectedGroupId}
          />
        </div>

        {/* Selected Group Info */}
        {selectedGroup && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedGroup.name}</h3>
                <p className="text-sm text-gray-600">Ready to upload</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Zone */}
        <div
          className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-purple-400 bg-purple-50'
              : selectedGroupId
              ? 'border-gray-300 bg-white/60 backdrop-blur-sm hover:border-purple-300 hover:bg-purple-50/50'
              : 'border-gray-200 bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            if (selectedGroupId) setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="file-upload"
            disabled={!selectedGroupId}
          />
          
          <div className="space-y-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
              selectedGroupId 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                : 'bg-gray-300'
            }`}>
              <UploadIcon className={`w-8 h-8 ${selectedGroupId ? 'text-white' : 'text-gray-500'}`} />
            </div>
            
            <div>
              <p className={`text-xl font-semibold mb-2 ${
                selectedGroupId ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {selectedGroupId ? 'Drop your photos here' : 'Select an album first'}
              </p>
              <p className={`mb-4 ${selectedGroupId ? 'text-gray-500' : 'text-gray-400'}`}>
                {selectedGroupId ? 'or click to browse your files' : 'Choose an album to upload photos'}
              </p>
              {selectedGroupId && (
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform cursor-pointer"
                >
                  <span>Choose Files</span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Uploaded Photos</h2>
            
            <div className="grid gap-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={file.preview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <LoadingSpinner size="sm" />
                            <span className="text-sm text-gray-500">Uploading...</span>
                          </div>
                        </div>
                      )}
                      
                      {file.status === 'completed' && (
                        <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                          <Check className="w-4 h-4" />
                          <span>Upload complete</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Upload;
