
import React from 'react';
import { X, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface Photo {
  id: string;
  src: string;
  alt: string;
  uploadDate: string;
  detectedFaces?: string[];
}

interface PhotoLightboxProps {
  isOpen: boolean;
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  isOpen,
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrevious
}) => {
  if (!isOpen || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={onPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Photo Container */}
      <div className="max-w-4xl max-h-full p-4 flex flex-col items-center">
        <img
          src={currentPhoto.src}
          alt={currentPhoto.alt}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        
        {/* Photo Info */}
        <div className="mt-4 text-center">
          <p className="text-white/80 text-sm mb-2">
            {new Date(currentPhoto.uploadDate).toLocaleDateString()}
          </p>
          
          {currentPhoto.detectedFaces && currentPhoto.detectedFaces.length > 0 && (
            <div className="flex items-center justify-center space-x-2 text-white/80">
              <User className="w-4 h-4" />
              <span className="text-sm">
                {currentPhoto.detectedFaces.join(', ')}
              </span>
            </div>
          )}
          
          <p className="text-white/60 text-xs mt-2">
            {currentIndex + 1} of {photos.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoLightbox;
