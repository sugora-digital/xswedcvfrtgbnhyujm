const fs = require('fs');

let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const startStr = `                    {filteredConversations.map((conv) => {`;
const startIdx = content.indexOf(startStr);

if (startIdx === -1) {
  console.log("Could not find start");
  process.exit(1);
}

// Find the end of this map loop. It ends with:
//                      );
//                    })}
//                  </div>
const endStr = `                      );
                    })}
                  </div>`;
                  
const endIdx = content.indexOf(endStr, startIdx);
if (endIdx === -1) {
  console.log("Could not find end");
  process.exit(1);
}

const finalEndIdx = endIdx + endStr.length;

const newMap = `                    {filteredConversations.map((conv) => {
                      const recipient = conv.recipient;
                      if (!recipient) return null;
                      const isPinned = conv.pinned_by?.includes(currentUser?.id);
                      const isMuted = conv.muted_by?.includes(currentUser?.id);
                      const isOnline = chatStore.getPresence(recipient.id).status === 'online';
                      const isAway = chatStore.getPresence(recipient.id).status === 'away';
                      
                      const hasUnread = conv.unreadCount > 0;
                      
                      return (
                        <div key={conv.id} className="relative overflow-hidden rounded-[24px] mb-1 group">
                          {/* Background Swipe Actions */}
                          <div className="absolute inset-y-0 right-0 flex items-center justify-end px-3 gap-2 w-full bg-neutral-100 dark:bg-zinc-900 rounded-[24px]">
                            <button className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-zinc-800 flex items-center justify-center text-neutral-500 hover:text-amber-500">
                              <Archive className="h-4 w-4" />
                            </button>
                            <button className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-zinc-800 flex items-center justify-center text-neutral-500 hover:text-teal-500">
                              <VolumeX className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); chatStore.deleteConversation(conv.id, currentUser.id); }}
                              className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-500 hover:text-red-600"
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
                            className={\`relative z-10 flex items-center gap-3.5 p-3 rounded-[24px] cursor-pointer transition-colors select-none \${
                              activeConv?.id === conv.id
                                ? 'bg-white dark:bg-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none'
                                : 'bg-transparent hover:bg-white/50 dark:hover:bg-zinc-800/50'
                            }\`}
                          >
                          {/* Premium Avatar Container */}
                          <div className="relative shrink-0 pointer-events-none">
                            <div className="h-[52px] w-[52px] rounded-full bg-neutral-100 dark:bg-zinc-800 border-2 border-transparent group-hover:border-neutral-200/50 dark:group-hover:border-zinc-700/50 overflow-hidden flex items-center justify-center font-black text-teal-600 text-sm transition-colors">
                              {recipient.avatar ? (
                                <img src={recipient.avatar} alt={recipient.display_name ?? 'Recipient'} className="h-full w-full object-cover" />
                              ) : (
                                (recipient.display_name ?? '').slice(0, 2).toUpperCase()
                              )}
                            </div>
                            
                            {/* Presence Status - Telegram style (small dot on corner) */}
                            {isOnline && (
                              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-zinc-950" />
                            )}
                            {!isOnline && isAway && (
                              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-amber-500 border-2 border-white dark:border-zinc-950" />
                            )}
                          </div>

                          {/* Meta info column */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center pointer-events-none">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="font-bold text-sm truncate flex items-center gap-1.5 text-neutral-900 dark:text-zinc-100">
                                {recipient.display_name}
                                {recipient.role !== 'User' && (
                                  <span className="text-[9px] bg-indigo-500/10 text-indigo-500 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                    {recipient.role}
                                  </span>
                                )}
                              </span>
                              
                              <span className={\`text-[11px] shrink-0 font-medium \${hasUnread ? 'text-teal-600 dark:text-teal-500 font-bold' : 'text-neutral-400'}\`}>
                                {conv.lastMessage ? new Date(conv.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <p className={\`text-[13px] truncate flex-1 leading-snug \${hasUnread ? 'text-neutral-700 dark:text-zinc-300 font-medium' : 'text-neutral-500 dark:text-zinc-400 font-normal'}\`}>
                                {conv.lastMessage ? (
                                  conv.lastMessage.deleted_for_everyone ? (
                                    <span className="italic text-neutral-400">Deleted message</span>
                                  ) : (
                                    conv.lastMessage.text || (
                                      <span className="flex items-center gap-1">
                                        <ImageIcon className="h-3.5 w-3.5" /> Photo
                                      </span>
                                    )
                                  )
                                ) : (
                                  <span className="text-teal-500">Draft</span>
                                )}
                              </p>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {isPinned && <Pin className="h-3.5 w-3.5 text-neutral-400 rotate-45" />}
                                {isMuted && <VolumeX className="h-3.5 w-3.5 text-neutral-400" />}
                                {hasUnread && (
                                  <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-teal-500 text-white font-bold text-[11px] shadow-sm animate-pulse-soft">
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
                  </div>`;

const before = content.slice(0, startIdx);
const after = content.slice(finalEndIdx);
fs.writeFileSync('src/components/ChatPlaceholder.tsx', before + newMap + after);
console.log("Chat item safe patched");
