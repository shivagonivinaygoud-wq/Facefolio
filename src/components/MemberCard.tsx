
import React from 'react';
import { User, Phone, Edit, Trash2 } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
}

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
          {member.profilePicture ? (
            <img
              src={member.profilePicture}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-purple-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Phone className="w-3 h-3" />
            <span>{member.phoneNumber}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(member)}
            className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
