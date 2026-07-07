const fs = require('fs');

const appendText = `
        {/* MAIN MESSAGING CANVAS AREA */}
        <main className="flex-1 bg-white dark:bg-[#09090B] flex flex-col relative overflow-hidden">
          {activeConv ? (
            <>
              {/* Active Header bar */}
              <div className="h-[76px] border-b border-neutral-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-xl px-4 flex items-center justify-between shrink-0 z-10 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => setActiveConv(null)}
                    className="h-10 w-10 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800 md:hidden shrink-0 transition-colors"
                  >
                    <ArrowLeft className="h-[22px] w-[22px]" />
                  </button>
                  
                  {/* Premium Header Avatar */}
                  <div className="relative shrink-0 flex items-center gap-3.5 cursor-pointer group" onClick={() => setShowProfileDrawer(true)}>
                    <div className="relative">
                      <div className="h-[50px] w-[50px] rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 flex items-center justify-center font-bold text-[#6C4EFF] text-sm overflow-hidden border border-neutral-100 dark:border-zinc-800/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] group-hover:shadow-md transition-all">
                        {activeConv.recipient?.avatar ? (
                          <img src={activeConv.recipient.avatar} alt={activeConv.recipient?.display_name ?? 'Recipient'} className="h-full w-full object-cover" />
                        ) : (
                          (activeConv.recipient?.display_name ?? '').slice(0, 2).toUpperCase()
                        )}
                      </div>
                      {chatStore.getPresence(activeConv.recipient?.id || '').status === 'online' && (
                        <span className="absolute bottom-0 right-0 h-[14px] w-[14px] rounded-full bg-[#10B981] border-[2.5px] border-white dark:border-[#09090B]" />
                      )}
                    </div>
                    
                    <div className="min-w-0 flex flex-col justify-center gap-0.5">
                      <h3 className="font-bold text-[16px] text-neutral-900 dark:text-white flex items-center gap-1.5 truncate">
                        {activeConv.recipient?.display_name}
                        {activeConv.recipient?.email_verified && (
                          <BadgeCheck className="h-[18px] w-[18px] text-[#6C4EFF] fill-[#6C4EFF]/10" />
                        )}
                      </h3>
                      <p className="text-[13px] text-[#10B981] font-semibold truncate flex items-center gap-1.5">
                        {chatStore.getPresence(activeConv.recipient?.id || '').status === 'online' ? (
                          <>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                            </span>
                            Online
                          </>
                        ) : (
                          <span className="text-neutral-400 font-medium">Offline</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => callingStore.startCall(activeConv.recipient, 'voice')}
                    className="h-10 w-10 flex items-center justify-center rounded-full text-[#6C4EFF] border border-neutral-200/60 dark:border-zinc-800/60 hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-sm transition-colors cursor-pointer group"
                    title="Voice Call"
                  >
                    <Phone className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => callingStore.startCall(activeConv.recipient, 'video')}
                    className="h-10 w-10 flex items-center justify-center rounded-full text-[#6C4EFF] border border-neutral-200/60 dark:border-zinc-800/60 hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-sm transition-colors cursor-pointer group"
                    title="Video Call"
                  >
                    <Video className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
                  </button>
                  <div className="w-px h-6 bg-neutral-200 dark:bg-zinc-800 mx-1" />
                  <button className="h-10 w-10 flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-700 border border-neutral-200/60 dark:border-zinc-800/60 hover:bg-neutral-50 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 shadow-sm transition-colors cursor-pointer">
                    <Search className="h-[18px] w-[18px]" />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowMenu(!showMenu)}
                      className="h-10 w-10 flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-700 border border-neutral-200/60 dark:border-zinc-800/60 hover:bg-neutral-50 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 shadow-sm transition-colors cursor-pointer relative"
                    >
                      <MoreVertical className="h-[18px] w-[18px]" />
                    </button>
                    <AnimatePresence>
                      {showMenu && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 top-12 w-56 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl border border-neutral-200/50 dark:border-zinc-800/50 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 z-50 origin-top-right overflow-hidden"
                        >
                          <div className="flex flex-col gap-1">
                            <button onClick={() => { setShowMenu(false); setShowProfileDrawer(true); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-[14px] text-[14px] font-medium text-neutral-700 dark:text-zinc-200 transition-colors cursor-pointer"><User className="h-4 w-4" /> View Profile</button>
                            <button onClick={() => { setShowMenu(false); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-[14px] text-[14px] font-medium text-neutral-700 dark:text-zinc-200 transition-colors cursor-pointer"><VolumeX className="h-4 w-4" /> Mute Notifications</button>
                            <div className="h-px bg-neutral-100 dark:bg-zinc-800 my-1 mx-2" />
                            <button onClick={() => { setShowMenu(false); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[14px] text-[14px] font-medium text-red-500 transition-colors cursor-pointer"><ShieldAlert className="h-4 w-4" /> Block User</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed dark:opacity-5">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#6C4EFF] blur-2xl opacity-20 rounded-full" />
                      <div className="p-6 rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 text-[#6C4EFF] relative border border-[#6C4EFF]/20">
                        <MessageSquare className="h-10 w-10" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-neutral-900 dark:text-white">Start the conversation</h3>
                      <p className="text-[14px] text-neutral-500 max-w-sm mt-1">Send a message or a sticker to say hello to {activeConv.recipient?.display_name}.</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-4 w-full">
                    {messages.map((msg, idx) => {
                      const isMe = msg.sender_id === currentUser.id;
                      const showAvatar = !isMe && (idx === 0 || messages[idx - 1].sender_id !== msg.sender_id);
                      
                      return (
                        <div key={msg.id} className={\`flex gap-3 \${isMe ? 'justify-end' : 'justify-start'}\`}>
                          {!isMe && (
                            <div className="w-8 shrink-0 flex items-end pb-1">
                              {showAvatar && (
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 flex items-center justify-center font-bold text-[#6C4EFF] text-[10px] overflow-hidden border border-neutral-100 dark:border-zinc-800 shadow-sm cursor-pointer" onClick={() => setShowProfileDrawer(true)}>
                                  {activeConv.recipient?.avatar ? (
                                    <img src={activeConv.recipient.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                  ) : (
                                    (activeConv.recipient?.display_name ?? '').slice(0, 2).toUpperCase()
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className={\`flex flex-col gap-1 \${isMe ? 'items-end' : 'items-start'} max-w-[75%] sm:max-w-[65%]\`}>
                            {/* Message bubble */}
                            <div className={\`px-4 py-2.5 rounded-[20px] relative group \${
                              isMe 
                                ? 'bg-gradient-to-br from-[#6C4EFF] via-[#7B61FF] to-[#00C8FF] text-white rounded-br-[4px] shadow-[0_4px_15px_-3px_rgba(108,78,255,0.4)]' 
                                : 'bg-white dark:bg-zinc-900 text-neutral-800 dark:text-zinc-100 rounded-bl-[4px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-neutral-100 dark:border-zinc-800/80'
                            }\`}>
                              {/* Hover actions */}
                              <div className={\`absolute top-1/2 -translate-y-1/2 \${isMe ? '-left-12' : '-right-12'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1\`}>
                                <button onClick={() => setReplyingTo(msg)} className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-zinc-200 transition-colors shadow-sm bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700">
                                  <Reply className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              {/* Attachments */}
                              {msg.attachment && (
                                <div className="mb-2">
                                  {msg.type === 'image' && (
                                    <img 
                                      src={msg.attachment.file_url} 
                                      alt="Attachment" 
                                      className="rounded-[16px] max-h-[300px] w-auto object-contain cursor-pointer shadow-sm hover:scale-[1.01] transition-transform" 
                                      onClick={() => setLightboxImage(msg.attachment.file_url)}
                                    />
                                  )}
                                  {msg.type === 'video' && (
                                    <video src={msg.attachment.file_url} controls className="rounded-[16px] max-h-[300px] w-auto bg-black/5" />
                                  )}
                                  {msg.type === 'document' && (
                                    <div className={\`flex items-center gap-3 p-3 rounded-xl \${isMe ? 'bg-white/15' : 'bg-neutral-100 dark:bg-zinc-800'}\`}>
                                      <FileText className={\`h-6 w-6 \${isMe ? 'text-white' : 'text-[#6C4EFF]'}\`} />
                                      <div className="min-w-0">
                                        <p className="font-bold text-[13px] truncate">{msg.attachment.file_name}</p>
                                        <p className={\`text-[11px] \${isMe ? 'text-white/80' : 'text-neutral-500'}\`}>{(msg.attachment.file_size / 1024 / 1024).toFixed(2)} MB</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Text content */}
                              {msg.text && (
                                <p className="text-[15px] leading-relaxed font-sans whitespace-pre-wrap">
                                  {msg.text}
                                </p>
                              )}

                              {/* Meta row */}
                              <div className={\`flex items-center justify-end gap-1.5 mt-1 text-[10px] font-bold select-none \${isMe ? 'text-white/80' : 'text-neutral-400'}\`}>
                                <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {isMe && (
                                  <span className="ml-0.5">
                                    {msg.status === 'sent' && <Check className="h-[14px] w-[14px]" />}
                                    {msg.status === 'delivered' && <CheckCheck className="h-[14px] w-[14px]" />}
                                    {msg.status === 'read' && <CheckCheck className="h-[15px] w-[15px] text-[#10B981] drop-shadow-sm" />}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Composer */}
              <div className="p-4 bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-xl border-t border-neutral-200/50 dark:border-zinc-800/50 relative z-20">
                <form 
                  onSubmit={handleSendMessage}
                  onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                  className="max-w-3xl mx-auto flex items-end gap-2 sm:gap-3"
                >
                  <div className="flex items-center gap-1 pb-1">
                    <button type="button" className="p-2.5 rounded-full text-neutral-400 hover:text-[#6C4EFF] hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all cursor-pointer">
                      <Plus className="h-6 w-6" />
                    </button>
                    <button type="button" className="p-2.5 rounded-full text-neutral-400 hover:text-[#6C4EFF] hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all cursor-pointer hidden sm:block">
                      <ImageIcon className="h-[22px] w-[22px]" />
                    </button>
                    <button type="button" className="p-2.5 rounded-full text-neutral-400 hover:text-[#6C4EFF] hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all cursor-pointer hidden sm:block">
                      <Sticker className="h-[22px] w-[22px]" />
                    </button>
                  </div>
                  
                  <div className="flex-1 bg-neutral-100/80 dark:bg-zinc-900 rounded-[24px] border border-transparent focus-within:border-neutral-200 dark:focus-within:border-zinc-700/80 focus-within:bg-white dark:focus-within:bg-zinc-950 transition-all shadow-sm focus-within:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative flex items-center min-h-[48px]">
                    <button type="button" className="absolute left-3 bottom-[11px] text-neutral-400 hover:text-[#6C4EFF] transition-colors p-1 rounded-full cursor-pointer">
                      <Smile className="h-5 w-5" />
                    </button>
                    <textarea 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="w-full bg-transparent resize-none py-[13px] pl-12 pr-12 text-[15px] font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none max-h-[120px]"
                      rows={1}
                      style={{ minHeight: '48px' }}
                    />
                    <button type="button" className="absolute right-3 bottom-[11px] text-neutral-400 hover:text-[#6C4EFF] transition-colors p-1 rounded-full cursor-pointer">
                      <Paperclip className="h-[18px] w-[18px]" />
                    </button>
                  </div>

                  <div className="pb-1">
                    <button 
                      type="submit"
                      disabled={!messageText.trim() && !attachment}
                      className={\`h-12 w-12 flex items-center justify-center rounded-full shadow-[0_4px_15px_-3px_rgba(108,78,255,0.4)] transition-all \${
                        messageText.trim() || attachment 
                          ? 'bg-gradient-to-tr from-[#6C4EFF] to-[#00C8FF] text-white hover:scale-105 cursor-pointer' 
                          : 'bg-gradient-to-tr from-[#6C4EFF] to-[#00C8FF] text-white hover:scale-105 cursor-pointer'
                      }\`}
                    >
                      {messageText.trim() || attachment ? (
                        <Send className="h-[20px] w-[20px] ml-1" />
                      ) : (
                        <Mic className="h-[20px] w-[20px]" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[#F8FAFC] dark:bg-[#09090B]">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6C4EFF] via-[#7B61FF] to-[#00C8FF] blur-[40px] opacity-20 rounded-full" />
                <div className="h-24 w-24 rounded-[32px] bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800 shadow-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#6C4EFF]/5 to-[#00C8FF]/5" />
                  <Sparkles className="h-10 w-10 text-[#6C4EFF]" />
                </div>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white mb-2">Sugora Chat</h1>
              <p className="text-[15px] text-neutral-500 font-medium max-w-sm mx-auto leading-relaxed">
                Connect seamlessly with end-to-end encrypted messaging, crystal clear voice calls, and high-fidelity media sharing.
              </p>
              <button onClick={() => setIsNewChatOpen(true)} className="mt-8 px-6 py-3 rounded-full bg-gradient-to-tr from-[#6C4EFF] to-[#00C8FF] text-white font-bold shadow-[0_4px_20px_-4px_rgba(108,78,255,0.5)] hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer">
                <Plus className="h-5 w-5" /> Start Messaging
              </button>
            </div>
          )}
        </main>

        {/* Profile Drawer */}
        <AnimatePresence>
          {showProfileDrawer && activeConv?.recipient && (
            <motion.aside
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-[#09090B] border-l border-neutral-200/50 dark:border-zinc-800/50 shadow-2xl z-50 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200/50 dark:border-zinc-800/50 shrink-0">
                <h3 className="font-bold text-[15px] text-neutral-900 dark:text-white">Contact Info</h3>
                <button onClick={() => setShowProfileDrawer(false)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-neutral-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 overflow-hidden border-4 border-white dark:border-zinc-950 shadow-lg relative">
                    {activeConv.recipient?.avatar ? (
                      <img src={activeConv.recipient.avatar} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-bold text-3xl text-[#6C4EFF]">
                        {(activeConv.recipient?.display_name ?? '').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-1.5">
                      {activeConv.recipient?.display_name}
                      {activeConv.recipient?.email_verified && <BadgeCheck className="h-5 w-5 text-[#6C4EFF]" />}
                    </h2>
                    <p className="text-[14px] text-neutral-500 font-medium">@{activeConv.recipient?.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-4 py-4 border-y border-neutral-100 dark:border-zinc-800/50">
                  <button className="flex flex-col items-center gap-1.5 text-neutral-500 hover:text-[#6C4EFF] transition-colors cursor-pointer group">
                    <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-zinc-800 group-hover:bg-[#6C4EFF]/10 flex items-center justify-center transition-colors">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold">Audio</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 text-neutral-500 hover:text-[#6C4EFF] transition-colors cursor-pointer group">
                    <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-zinc-800 group-hover:bg-[#6C4EFF]/10 flex items-center justify-center transition-colors">
                      <Video className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold">Video</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 text-neutral-500 hover:text-[#6C4EFF] transition-colors cursor-pointer group">
                    <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-zinc-800 group-hover:bg-[#6C4EFF]/10 flex items-center justify-center transition-colors">
                      <Search className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold">Search</span>
                  </button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider px-1">About</h4>
                  <div className="p-4 rounded-[20px] bg-neutral-50 dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800/50">
                    <p className="text-[14px] text-neutral-700 dark:text-zinc-300">
                      {activeConv.recipient?.bio || "Hey there! I am using Sugora."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Nav */}
        <nav className="md:hidden border-t border-neutral-200/50 dark:border-zinc-800/50 bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-xl h-[64px] flex items-center justify-around pb-safe z-50">
          {[
            { id: 'chats', icon: MessageSquare, label: 'Chats' },
            { id: 'calls', icon: Phone, label: 'Calls' },
            { id: 'contacts', icon: Users, label: 'Contacts' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveNavTab(tab.id)}
              className={\`flex flex-col items-center gap-1 p-2 w-16 transition-colors cursor-pointer \${
                activeNavTab === tab.id ? 'text-[#6C4EFF]' : 'text-neutral-400'
              }\`}
            >
              <tab.icon className={\`h-5 w-5 \${activeNavTab === tab.id ? 'fill-current opacity-20' : ''}\`} />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button onClick={() => setLightboxImage(null)} className="absolute top-6 right-6 text-white/50 hover:text-white p-2 cursor-pointer z-50">
              <X className="h-8 w-8" />
            </button>
            <img src={lightboxImage} alt="Fullscreen view" className="max-w-full max-h-[90vh] object-contain select-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatPlaceholder;
`;

fs.appendFileSync('src/components/ChatPlaceholder.tsx', appendText);
console.log("Restored Main component!");
