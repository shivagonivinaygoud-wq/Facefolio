
import React, { useState, useCallback } from 'react';
import { Upload as UploadIcon, X, Check, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  faces?: number;
}

const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
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
      
      // Simulate upload progress
      simulateUpload(id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadedFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { 
                ...file, 
                progress: 100, 
                status: 'completed',
                faces: Math.floor(Math.random() * 4) + 1 // Random number of faces
              }
            : file
        ));
      } else {
        setUploadedFiles(prev => prev.map(file => 
          file.id === fileId ? { ...file, progress } : file
        ));
      }
    }, 500);
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

  const startFaceClassification = (fileId: string) => {
    // Placeholder for face classification API call
    console.log(`Starting face classification for file: ${fileId}`);
    // In a real app, this would call your backend API
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Photos</h1>
          <p className="text-lg text-gray-600">
            Drag and drop your images or click to select files
          </p>
        </div>

        {/* Upload Zone */}
        <div
          className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-purple-400 bg-purple-50'
              : 'border-gray-300 bg-white/60 backdrop-blur-sm hover:border-purple-300 hover:bg-purple-50/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
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
          />
          
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
              <UploadIcon className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Drop your photos here
              </p>
              <p className="text-gray-500 mb-4">
                or click to browse your files
              </p>
              <label
                htmlFor="file-upload"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform cursor-pointer"
              >
                <span>Choose Files</span>
              </label>
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
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500">
                              {Math.round(file.progress)}%
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {file.status === 'completed' && file.faces && (
                        <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                          <Check className="w-4 h-4" />
                          <span>{file.faces} face{file.faces > 1 ? 's' : ''} detected</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {file.status === 'uploading' && <LoadingSpinner size="sm" />}
                      
                      {file.status === 'completed' && (
                        <button
                          onClick={() => startFaceClassification(file.id)}
                          className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                        >
                          <Users className="w-4 h-4" />
                          <span>Classify</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
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
