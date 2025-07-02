
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import MemberCard from '../components/MemberCard';
import AddMemberModal from '../components/AddMemberModal';

interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
}

const GroupMembers = () => {
  const { groupId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      phoneNumber: '+1 (555) 123-4567',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b5b8ef3c?w=100'
    },
    {
      id: '2',
      name: 'Mike Chen',
      phoneNumber: '+1 (555) 987-6543'
    },
    {
      id: '3',
      name: 'Emily Davis',
      phoneNumber: '+1 (555) 456-7890',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    }
  ]);

  const groupName = groupId === '1' ? 'Family Vacation 2024' : 
                   groupId === '2' ? 'Birthday Party' : 'Kids Activities';

  const handleAddMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      id: (members.length + 1).toString(),
      ...memberData
    };
    setMembers([...members, newMember]);
  };

  const handleEditMember = (member: Member) => {
    console.log('Edit member:', member);
    // In a real app, this would open an edit modal
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/gallery/${groupId}`}
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gallery</span>
          </Link>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{groupName}</h1>
                <p className="text-gray-600 mb-4">Manage group members</p>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600">{members.length} Member{members.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            </div>
          </div>
        </div>

        {/* Members List */}
        {members.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Members Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add members to this group to help with face recognition and photo organization.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Member</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
              />
            ))}
          </div>
        )}
      </main>

      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddMember}
      />
    </div>
  );
};

export default GroupMembers;
