
import React, { useState } from 'react';
import { X, Upload, User } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: Omit<Member, 'id'>) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    profilePicture: ''
  });
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImagePreview(result);
        setFormData({ ...formData, profilePicture: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.phoneNumber.trim()) {
      onSubmit(formData);
      setFormData({ name: '', phoneNumber: '', profilePicture: '' });
      setProfileImagePreview('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Add Member</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Profile Picture Upload */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center overflow-hidden">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-purple-400" />
                )}
              </div>
              <label
                htmlFor="profile-image"
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              >
                <Upload className="w-4 h-4 text-white" />
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">Upload profile picture</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:scale-105 transition-transform font-medium"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
