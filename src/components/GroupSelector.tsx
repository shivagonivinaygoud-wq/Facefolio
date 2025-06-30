
import React from 'react';
import { FolderOpen, ChevronDown } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  photoCount: number;
}

interface GroupSelectorProps {
  groups: Group[];
  selectedGroupId: string;
  onGroupSelect: (groupId: string) => void;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  groups,
  selectedGroupId,
  onGroupSelect,
}) => {
  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Album *
      </label>
      <div className="relative">
        <select
          value={selectedGroupId}
          onChange={(e) => onGroupSelect(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Choose an album...</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name} ({group.photoCount} photos)
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      
      {selectedGroup && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: <span className="font-medium">{selectedGroup.name}</span>
        </div>
      )}
    </div>
  );
};

export default GroupSelector;
