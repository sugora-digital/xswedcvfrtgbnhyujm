const fs = require('fs');
let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const targetStart = `<div className="space-y-0.5">
                    {filteredUsersToChat.map((user) => {`;
const targetEnd = `{/* Active Header bar */}`;

if (content.includes(targetStart)) {
  const startIdx = content.indexOf(targetStart);
  const endIdx = content.indexOf(targetEnd, startIdx);

  const replacement = `<div className="space-y-0.5">
                    {filteredUsersToChat.map((user) => {
                      const isOnline = chatStore.getPresence(user.id).status === 'online';
                      return (
                        <div
                          key={user.id}
                          onClick={() => handleStartDirectChat(user)}
                          className="flex items-center gap-3 p-3 rounded-[20px] hover:bg-white dark:hover:bg-zinc-900 shadow-sm cursor-pointer transition-all border border-transparent hover:border-neutral-100 dark:hover:border-zinc-800"
                        >
                          <div className="relative shrink-0 pointer-events-none">
                            <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 overflow-hidden flex items-center justify-center font-bold text-[#6C4EFF] text-xs">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.display_name} className="h-full w-full object-cover animate-fade-in" />
                              ) : (
                                (user.display_name || '').substring(0, 2).toUpperCase()
                              )}
                            </div>
                            {isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#10B981] ring-2 ring-white dark:ring-zinc-950" />}
                          </div>
                          <div className="min-w-0 flex-1 pointer-events-none">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-[14px] text-neutral-900 dark:text-white truncate">
                                {user.display_name}
                              </p>
                              {user.email_verified && (
                                <BadgeCheck className="h-3.5 w-3.5 text-[#6C4EFF] fill-[#6C4EFF]/10" />
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-500 font-medium truncate">@{user.username}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (<>
              {/* Search bar and Filters header */}
              <div className="p-4 space-y-4 shrink-0 bg-[#F8FAFC]/50 dark:bg-[#09090B]/50 backdrop-blur-xl border-b border-neutral-200/50 dark:border-zinc-800/50 relative z-20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Chats
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="h-10 w-10 flex items-center justify-center rounded-full border border-neutral-200/60 dark:border-zinc-800/60 text-neutral-500 hover:text-neutral-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                      <Edit3 className="h-[18px] w-[18px]" />
                    </button>
                    <button 
                      onClick={() => setIsNewChatOpen(true)}
                      className="px-4 h-10 rounded-full bg-gradient-to-tr from-[#6C4EFF] to-[#00C8FF] hover:opacity-90 text-white font-semibold text-[14px] flex items-center gap-1.5 shadow-[0_4px_15px_-3px_rgba(108,78,255,0.4)] transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>New DM</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400 group-focus-within:text-[#6C4EFF] transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search messages..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 bg-white dark:bg-zinc-900 rounded-[20px] text-[14px] focus:outline-none border border-neutral-200/60 dark:border-zinc-800/60 focus:border-[#6C4EFF]/50 focus:ring-4 focus:ring-[#6C4EFF]/10 transition-all shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] font-medium"
                    />
                    <button className="absolute right-3.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-neutral-100 dark:bg-zinc-800 rounded-full text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer">
                      <SlidersHorizontal className="h-[14px] w-[14px]" />
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-6 border-b border-neutral-200/50 dark:border-zinc-800/50 px-1 mt-2">
                  {(['all', 'unread', 'archived', 'calls'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={\`relative pb-3 text-[14px] font-bold capitalize transition-all cursor-pointer \${
                        activeTab === tab
                          ? 'text-[#6C4EFF]'
                          : 'text-neutral-500 hover:text-neutral-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                      }\`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeFilterTab"
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#6C4EFF] rounded-t-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

          {/* Conversation List Scroll Area */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {activeTab === 'calls' ? (
              callHistory.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-2">
                  <Phone className="h-8 w-8 text-neutral-350 dark:text-zinc-700 mx-auto animate-pulse" />
                  <p className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">No call records found</p>
                </div>
              ) : (
                callHistory.map((call) => {
                  const otherUserId = call.caller_id === currentUser?.id ? call.receiver_id : call.caller_id;
                  const otherUser = chatStore.getProfiles().find(p => p.id === otherUserId);
                  const isIncoming = call.receiver_id === currentUser?.id;
                  const isVideo = call.type === 'video';
                  const name = otherUser?.display_name || otherUser?.username || 'Unknown Shard';
                  
                  return (
                    <div
                      key={call.id}
                      className="flex items-center justify-between p-3 rounded-[20px] hover:bg-white dark:hover:bg-zinc-900 transition-all select-none text-left cursor-pointer border border-transparent hover:border-neutral-100 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative shrink-0 pointer-events-none">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 overflow-hidden flex items-center justify-center font-bold text-[#6C4EFF] text-xs">
                            {otherUser?.avatar ? (
                              <img src={otherUser.avatar} alt={name} className="h-full w-full object-cover" />
                            ) : (
                              name.substring(0, 2).toUpperCase()
                            )}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-[15px] text-neutral-900 dark:text-white truncate">
                            {name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium mt-0.5">
                            {isVideo ? <Video className="h-3.5 w-3.5 inline text-teal-500" /> : <Phone className="h-3.5 w-3.5 inline text-teal-500" />}
                            <span>{isIncoming ? 'Incoming' : 'Outgoing'}</span>
                            <span className="h-1 w-1 bg-neutral-300 rounded-full" />
                            <span className={\`capitalize \${
                              call.status === 'completed' || call.status === 'active' ? 'text-emerald-500' : 'text-red-500'
                            }\`}>
                              {call.status}
                            </span>
                            {call.duration_seconds && call.duration_seconds > 0 && (
                              <>
                                <span className="h-1 w-1 bg-neutral-300 rounded-full" />
                                <span>{Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {otherUser && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => callingStore.startCall(otherUser, 'voice')}
                            className="p-2 rounded-full bg-neutral-100 hover:bg-[#6C4EFF] hover:text-white dark:bg-zinc-800 text-neutral-500 transition-colors cursor-pointer"
                          >
                            <Phone className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => callingStore.startCall(otherUser, 'video')}
                            className="p-2 rounded-full bg-neutral-100 hover:bg-[#6C4EFF] hover:text-white dark:bg-zinc-800 text-neutral-500 transition-colors cursor-pointer"
                          >
                            <Video className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <MessageSquare className="h-8 w-8 text-neutral-350 dark:text-zinc-700 mx-auto" />
                <p className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">No conversations found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConversations.length > 0 && (
                  <div className="space-y-1">
                    {searchQuery && (
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
                        Active Chats ({filteredConversations.length})
                      </div>
                    )}
                    {filteredConversations.map((conv) => {
                      const recipient = conv.recipient;
                      if (!recipient) return null;
                      const isPinned = conv.pinned_by?.includes(currentUser?.id);
                      const isMuted = conv.muted_by?.includes(currentUser?.id);
                      const isOnline = chatStore.getPresence(recipient.id).status === 'online';
                      const hasUnread = conv.unreadCount > 0;
                      
                      return (
                        <div key={conv.id} className="relative overflow-hidden rounded-[20px] mb-1.5 group">
                          {/* Background Swipe Actions */}
                          <div className="absolute inset-y-0 right-0 flex items-center justify-end px-3 gap-2 w-full bg-neutral-100 dark:bg-zinc-900 rounded-[20px]">
                            <button className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-neutral-500 hover:text-amber-500 transition-colors cursor-pointer">
                              <Archive className="h-4 w-4" />
                            </button>
                            <button className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-neutral-500 hover:text-[#6C4EFF] transition-colors cursor-pointer">
                              <VolumeX className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); chatStore.deleteConversation(conv.id, currentUser.id); }}
                              className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-500/10 shadow-sm flex items-center justify-center text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {/* Foreground Card */}
                          <motion.div
                            drag="x"
                            dragConstraints={{ left: -160, right: 0 }}
                            dragElastic={0.1}
                            dragDirectionLock
                            onClick={() => {
                              setActiveConv(conv);
                              chatStore.markAsRead(conv.id, currentUser.id);
                            }}
                            className={\`relative z-10 flex items-center gap-3.5 p-3 rounded-[20px] cursor-pointer transition-all select-none \${
                              activeConv?.id === conv.id
                                ? 'bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-neutral-100 dark:border-zinc-800/80 scale-[1.02]'
                                : 'bg-[#F8FAFC] hover:bg-white dark:bg-[#09090B] dark:hover:bg-zinc-900/60 border border-transparent hover:border-neutral-100 dark:hover:border-zinc-800/50'
                            }\`}
                          >
                            {/* Premium Avatar */}
                            <div className="relative shrink-0 pointer-events-none">
                              <div className="h-[52px] w-[52px] rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 flex items-center justify-center font-bold text-[#6C4EFF] text-sm overflow-hidden border border-white/50 dark:border-zinc-800/50 shadow-sm">
                                {recipient.avatar ? (
                                  <img src={recipient.avatar} alt={recipient.display_name ?? 'Recipient'} className="h-full w-full object-cover" />
                                ) : (
                                  (recipient.display_name ?? '').slice(0, 2).toUpperCase()
                                )}
                              </div>
                              {/* Online Indicator */}
                              {isOnline && (
                                <span className="absolute bottom-0 right-0 h-[14px] w-[14px] rounded-full bg-[#10B981] border-[2.5px] border-[#F8FAFC] group-hover:border-white dark:border-zinc-900 transition-colors" />
                              )}
                            </div>

                            {/* Meta Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center pointer-events-none pr-1">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-bold text-[15px] truncate flex items-center gap-1.5 text-neutral-900 dark:text-white">
                                  {recipient.display_name}
                                  {recipient.email_verified && (
                                    <BadgeCheck className="h-4 w-4 text-[#6C4EFF] fill-[#6C4EFF]/10" />
                                  )}
                                </span>
                                <span className={\`text-[11px] shrink-0 font-medium \${hasUnread ? 'text-[#6C4EFF] font-bold' : 'text-neutral-400'}\`}>
                                  {conv.lastMessage ? new Date(conv.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between gap-2">
                                <p className={\`text-[13px] truncate flex-1 leading-snug \${hasUnread ? 'text-neutral-900 dark:text-zinc-200 font-semibold' : 'text-neutral-500 dark:text-zinc-400 font-medium'}\`}>
                                  {chatStore.getTypingUsers(conv.id, currentUser.id).length > 0 ? (
                                    <span className="text-[#00C8FF] font-semibold flex items-center gap-1">
                                      Typing...
                                    </span>
                                  ) : conv.lastMessage ? (
                                    conv.lastMessage.deleted_for_everyone ? (
                                      <span className="italic text-neutral-400">Deleted message</span>
                                    ) : (
                                      conv.lastMessage.text || (
                                        <span className="flex items-center gap-1">
                                          <ImageIcon className="h-3.5 w-3.5" /> Media
                                        </span>
                                      )
                                    )
                                  ) : (
                                    <span className="text-neutral-400">Draft</span>
                                  )}
                                </p>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isPinned && <Pin className="h-3.5 w-3.5 text-neutral-400 rotate-45" />}
                                  {isMuted && <VolumeX className="h-3.5 w-3.5 text-neutral-400" />}
                                  {hasUnread && (
                                    <span className="h-[20px] min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-[#6C4EFF] text-white font-bold text-[11px] shadow-[0_2px_8px_-2px_rgba(108,78,255,0.4)]">
                                      {conv.unreadCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </aside>

`;

  content = content.slice(0, startIdx) + replacement + content.slice(endIdx);
  fs.writeFileSync('src/components/ChatPlaceholder.tsx', content);
  console.log("Aside fully reconstructed!");
} else {
  console.log("Could not find aside!");
}
