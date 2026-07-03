const fs = require('fs');

let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const oldReturn = `                      return (
                        <div
                          key={conv.id}
                          onClick={() => {
                            setActiveConv(conv);
                            chatStore.markAsRead(conv.id, currentUser.id);
                          }}
                          className={\`group relative flex items-center gap-3.5 p-3 rounded-[24px] cursor-pointer transition-all select-none \${
                            activeConv?.id === conv.id
                              ? 'bg-white dark:bg-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none'
                              : 'hover:bg-neutral-50/50 dark:hover:bg-zinc-900/30'
                          }\`}
                        >
                          {/* Premium Avatar Container */}
                          <div className="relative shrink-0">`;

const newReturn = `                      return (
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
                            <div className="relative shrink-0 pointer-events-none">`;

const oldEnd = `                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>`;
                  
const newEnd = `                              </div>
                            </div>
                          </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>`;

if (content.includes(oldReturn)) {
  content = content.replace(oldReturn, newReturn).replace(oldEnd, newEnd);
  fs.writeFileSync('src/components/ChatPlaceholder.tsx', content);
  console.log("Swipe patched");
} else {
  console.log("Swipe patch failed: could not find old string");
}
