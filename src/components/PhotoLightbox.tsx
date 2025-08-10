
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, User, Download, Trash2, MessageCircle } from 'lucide-react';
import WhatsAppShareModal from './WhatsAppShareModal';

interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
}

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
  members?: Member[];
  onDelete?: (photoId: string) => void;
  isOwner?: boolean;
}

const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  isOpen,
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
  members = [],
  onDelete,
  isOwner = false
}) => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  
  if (!isOpen || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentPhoto.src;
    link.download = `photo-${currentPhoto.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this photo?')) {
      onDelete(currentPhoto.id);
    }
  };

  const taggedMembers = members.filter(member => 
    currentPhoto.detectedFaces?.includes(member.name) && member.phoneNumber
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
        {/* Top Action Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              title="Download photo"
            >
              <Download className="w-5 h-5" />
            </button>
            
            {taggedMembers.length > 0 && (
              <button
                onClick={() => setShowWhatsAppModal(true)}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                title="Share via WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            )}
            
            {isOwner && onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 text-white hover:bg-red-500/20 rounded-full transition-colors"
                title="Delete photo"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

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

      <WhatsAppShareModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        members={taggedMembers}
        photoUrl={currentPhoto.src}
        photoName={currentPhoto.alt}
      />
    </>
  );
};

export default PhotoLightbox;
