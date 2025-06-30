
import React from 'react';

interface PhotoCardProps {
  src: string;
  alt: string;
  personName?: string;
  uploadDate?: string;
  className?: string;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ 
  src, 
  alt, 
  personName, 
  uploadDate,
  className = '' 
}) => {
  return (
    <div className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}>
      <div className="aspect-square overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {(personName || uploadDate) && (
        <div className="p-4">
          {personName && (
            <h3 className="font-medium text-gray-800 mb-1">{personName}</h3>
          )}
          {uploadDate && (
            <p className="text-sm text-gray-500">{uploadDate}</p>
          )}
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default PhotoCard;
