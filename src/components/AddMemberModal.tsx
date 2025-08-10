
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
  const [otpStage, setOtpStage] = useState<'phone' | 'otp' | 'verified'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

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

  const sendOTP = async () => {
    if (!formData.phoneNumber.trim()) return;
    
    setIsVerifying(true);
    setVerificationError('');
    
    try {
      // Simulate OTP sending - replace with actual SMS service
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpStage('otp');
    } catch (error) {
      setVerificationError('Failed to send OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpCode.trim()) return;
    
    setIsVerifying(true);
    setVerificationError('');
    
    try {
      // Simulate OTP verification - replace with actual verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (otpCode === '123456') { // Mock OTP for demo
        setOtpStage('verified');
      } else {
        setVerificationError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setVerificationError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && (otpStage === 'verified' || !formData.phoneNumber.trim())) {
      onSubmit({
        ...formData,
        phoneNumber: otpStage === 'verified' ? formData.phoneNumber : ''
      });
      setFormData({ name: '', phoneNumber: '', profilePicture: '' });
      setProfileImagePreview('');
      setOtpStage('phone');
      setOtpCode('');
      setVerificationError('');
      onClose();
    }
  };

  const resetModal = () => {
    setFormData({ name: '', phoneNumber: '', profilePicture: '' });
    setProfileImagePreview('');
    setOtpStage('phone');
    setOtpCode('');
    setVerificationError('');
    onClose();
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
              Phone Number (Optional)
            </label>
            <div className="space-y-3">
              <input
                id="phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={otpStage === 'verified'}
              />
              
              {formData.phoneNumber && otpStage === 'phone' && (
                <button
                  type="button"
                  onClick={sendOTP}
                  disabled={isVerifying}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isVerifying ? 'Sending...' : 'Verify Phone Number'}
                </button>
              )}
              
              {otpStage === 'otp' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center"
                  />
                  <button
                    type="button"
                    onClick={verifyOTP}
                    disabled={isVerifying || !otpCode}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Demo OTP: 123456
                  </p>
                </div>
              )}
              
              {otpStage === 'verified' && (
                <div className="flex items-center space-x-2 text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Phone number verified</span>
                </div>
              )}
              
              {verificationError && (
                <p className="text-sm text-red-600">{verificationError}</p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={resetModal}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || (formData.phoneNumber && otpStage !== 'verified')}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:scale-105 transition-transform font-medium disabled:opacity-50 disabled:hover:scale-100"
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
