import React, { useState } from 'react';
import { X, Send, MessageCircle, Check } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
}

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  photoUrl: string;
  photoName?: string;
}

const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  members,
  photoUrl,
  photoName = 'Photo'
}) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sentToMembers, setSentToMembers] = useState<string[]>([]);

  const verifiedMembers = members.filter(member => member.phoneNumber);

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAll = () => {
    setSelectedMembers(verifiedMembers.map(m => m.id));
  };

  const clearAll = () => {
    setSelectedMembers([]);
  };

  const sendToWhatsApp = async () => {
    if (selectedMembers.length === 0) return;

    setIsSending(true);
    
    try {
      // Simulate sending via WhatsApp API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedMemberObjects = verifiedMembers.filter(m => selectedMembers.includes(m.id));
      
      // In a real app, you would call your WhatsApp API here
      for (const member of selectedMemberObjects) {
        console.log(`Sending photo to ${member.name} at ${member.phoneNumber}`);
        // Mock API call would go here
      }
      
      setSentToMembers(selectedMembers);
      
      // Close modal after successful send
      setTimeout(() => {
        onClose();
        setSelectedMembers([]);
        setSentToMembers([]);
      }, 1500);
      
    } catch (error) {
      console.error('Failed to send photos:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-green-500" />
            <span>Share via WhatsApp</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <img
              src={photoUrl}
              alt={photoName}
              className="w-full h-32 object-cover rounded-lg"
            />
            <p className="text-sm text-gray-600 mt-2">Sharing: {photoName}</p>
          </div>

          {verifiedMembers.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No members with verified phone numbers</p>
              <p className="text-sm text-gray-500">Add members with verified phone numbers to share photos via WhatsApp</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Select recipients:</h3>
                <div className="space-x-2">
                  <button
                    onClick={selectAll}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {verifiedMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => !isSending && toggleMember(member.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedMembers.includes(member.id)
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex-shrink-0">
                      {member.profilePicture ? (
                        <img
                          src={member.profilePicture}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-sm">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.phoneNumber}</p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {sentToMembers.includes(member.id) ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : selectedMembers.includes(member.id) ? (
                        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-100 mt-6">
                <button
                  onClick={onClose}
                  disabled={isSending}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={sendToWhatsApp}
                  disabled={selectedMembers.length === 0 || isSending}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send ({selectedMembers.length})</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppShareModal;