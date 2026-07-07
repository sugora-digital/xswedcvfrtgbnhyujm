import React, { useState } from 'react';
import { Search, ChevronLeft, ArrowRight, Users, Check, Camera, Shield, X, BadgeCheck } from 'lucide-react';
import { chatStore } from '../../../lib/chatStore';

export const NewGroupPanel = ({ currentUser, onCancel, onGroupCreated }: { currentUser: any, onCancel: () => void, onGroupCreated: (group: any) => void }) => {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  
  // Group Details
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  
  // Permissions
  const [sendMessages, setSendMessages] = useState<'everyone' | 'admins'>('everyone');
  const [editInfo, setEditInfo] = useState<'everyone' | 'admins'>('everyone');
  const [inviteMembers, setInviteMembers] = useState<'everyone' | 'admins'>('everyone');

  const allProfiles = chatStore.getProfiles().filter(p => p.id !== currentUser?.id);
  const filteredProfiles = allProfiles.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.display_name?.toLowerCase().includes(q) || p.username?.toLowerCase().includes(q);
  });

  const handleToggleUser = (user: any) => {
    const isSelected = selectedUsers.find(u => u.id === user.id);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      if (selectedUsers.length >= 100) return; // Free plan limit
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateGroup = () => {
    // Generate Group ID
    const groupId = 'group-' + Math.random().toString(36).substring(2, 11);
    
    const newGroup = {
      id: groupId,
      type: 'group',
      title: groupName || 'New Group',
      description: groupDesc,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pinned_by: [],
      archived_by: [],
      muted_by: [],
      permissions: {
        send_messages: sendMessages,
        edit_info: editInfo,
        invite_members: inviteMembers
      },
      creator_id: currentUser.id
    };
    
    // Add Participants (include creator as admin)
    const members = [
      { conversation_id: groupId, user_id: currentUser.id, joined_at: new Date().toISOString(), role: 'admin' },
      ...selectedUsers.map(u => ({
        conversation_id: groupId,
        user_id: u.id,
        joined_at: new Date().toISOString(),
        role: 'member'
      }))
    ];

    chatStore.createGroup(newGroup, members);
    onGroupCreated(newGroup);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="p-4 border-b border-neutral-100 dark:border-zinc-900 flex items-center gap-3 shrink-0 bg-neutral-50/50 dark:bg-zinc-950">
        <button 
          onClick={() => {
            if (step > 1) setStep(step - 1);
            else onCancel();
          }}
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-900 text-neutral-500 dark:text-zinc-400 cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white leading-none">Create Group</h2>
          <p className="text-[11px] text-neutral-500 mt-0.5">Step {step} of 3</p>
        </div>
        {step === 1 && (
          <button 
            disabled={selectedUsers.length === 0}
            onClick={() => setStep(2)}
            className="h-8 px-3 rounded-full bg-[#6C4EFF] text-white text-[13px] font-bold disabled:opacity-50 flex items-center gap-1 cursor-pointer transition-opacity"
          >
            Next <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
        {step === 2 && (
          <button 
            disabled={!groupName.trim()}
            onClick={() => setStep(3)}
            className="h-8 px-3 rounded-full bg-[#6C4EFF] text-white text-[13px] font-bold disabled:opacity-50 flex items-center gap-1 cursor-pointer transition-opacity"
          >
            Next <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
        {step === 3 && (
          <button 
            onClick={handleCreateGroup}
            className="h-8 px-3 rounded-full bg-emerald-500 text-white text-[13px] font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-600 transition-colors"
          >
            Create
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {step === 1 && (
          <div className="p-4 h-full flex flex-col">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-bold text-neutral-900 dark:text-white">Add Members</span>
                <span className="text-[11px] font-medium text-neutral-500">{selectedUsers.length} / 100</span>
              </div>
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-neutral-400 group-focus-within:text-[#6C4EFF] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-100/50 dark:bg-zinc-900/50 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/20 transition-all font-medium"
                />
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-3 mb-2 shrink-0">
                {selectedUsers.map(u => (
                  <div key={u.id} className="flex items-center gap-1.5 px-2 py-1 bg-neutral-100 dark:bg-zinc-900 rounded-lg shrink-0">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 flex items-center justify-center text-[9px] font-bold text-[#6C4EFF] overflow-hidden">
                      {u.avatar ? <img src={u.avatar} className="h-full w-full object-cover" alt={u.username} /> : u.username?.substring(0,2).toUpperCase()}
                    </div>
                    <span className="text-[11px] font-medium text-neutral-700 dark:text-zinc-300">{u.display_name || u.username}</span>
                    <button onClick={() => handleToggleUser(u)} className="p-0.5 text-neutral-400 hover:text-red-500 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin">
              {filteredProfiles.map(user => {
                const isSelected = selectedUsers.some(u => u.id === user.id);
                return (
                  <div 
                    key={user.id}
                    onClick={() => handleToggleUser(user)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer border border-transparent hover:border-neutral-100 dark:hover:border-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 overflow-hidden flex items-center justify-center font-bold text-[#6C4EFF]">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                        ) : (
                          (user.display_name || user.username || '').substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[14px] text-neutral-900 dark:text-white flex items-center gap-1">
                          {user.display_name}
                          {user.email_verified && <BadgeCheck className="h-3.5 w-3.5 text-[#6C4EFF] fill-[#6C4EFF]/10" />}
                        </h4>
                        <p className="text-[12px] text-neutral-500">@{user.username}</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#6C4EFF] border-[#6C4EFF]' : 'border-neutral-300 dark:border-zinc-700'}`}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-neutral-100 dark:bg-zinc-900 flex items-center justify-center text-neutral-400 mb-3 cursor-pointer hover:bg-neutral-200 dark:hover:bg-zinc-800 transition-colors">
                <Camera className="h-8 w-8" />
              </div>
              <span className="text-[13px] font-medium text-[#6C4EFF] cursor-pointer hover:underline">Set Group Photo</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">Group Name</label>
                <input 
                  type="text" 
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Design Team, Weekend Trip"
                  maxLength={50}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-200 dark:border-zinc-800 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/20 transition-all text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">Description (Optional)</label>
                <textarea 
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  placeholder="What is this group about?"
                  rows={2}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-200 dark:border-zinc-800 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/20 transition-all text-neutral-900 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">Category (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Work, Social"
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-200 dark:border-zinc-800 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/20 transition-all text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">Emoji/Icon</label>
                  <input 
                    type="text" 
                    placeholder="🚀"
                    maxLength={2}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-200 dark:border-zinc-800 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/20 transition-all text-neutral-900 dark:text-white text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-4 space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Shield className="h-6 w-6 shrink-0" />
              <p className="text-[13px] font-medium">As the creator, you are an admin. You can configure who has permission to perform actions in this group.</p>
            </div>

            <div className="space-y-4">
              <PermissionToggle title="Who can send messages" value={sendMessages} onChange={setSendMessages} />
              <PermissionToggle title="Who can edit group info" value={editInfo} onChange={setEditInfo} />
              <PermissionToggle title="Who can invite members" value={inviteMembers} onChange={setInviteMembers} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PermissionToggle = ({ title, value, onChange }: { title: string, value: 'everyone' | 'admins', onChange: (val: 'everyone' | 'admins') => void }) => {
  return (
    <div className="border border-neutral-200 dark:border-zinc-800 rounded-xl p-4">
      <h4 className="font-bold text-[14px] text-neutral-900 dark:text-white mb-3">{title}</h4>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${value === 'everyone' ? 'border-[#6C4EFF]' : 'border-neutral-300 dark:border-zinc-700'}`}>
            {value === 'everyone' && <div className="h-2 w-2 rounded-full bg-[#6C4EFF]" />}
          </div>
          <span className="text-[13px] font-medium text-neutral-700 dark:text-zinc-300 group-hover:text-neutral-900 dark:group-hover:text-white">Everyone</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${value === 'admins' ? 'border-[#6C4EFF]' : 'border-neutral-300 dark:border-zinc-700'}`}>
            {value === 'admins' && <div className="h-2 w-2 rounded-full bg-[#6C4EFF]" />}
          </div>
          <span className="text-[13px] font-medium text-neutral-700 dark:text-zinc-300 group-hover:text-neutral-900 dark:group-hover:text-white">Admins only</span>
        </label>
      </div>
    </div>
  );
};
