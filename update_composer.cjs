const fs = require('fs');

let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const startMarker = `                ) : (\n                  <form onSubmit={handleSendMessage}`;
const endMarker = `                  </form>\n                )}\n              </div>\n            </>\n          ) : (\n            <div className="flex-1 flex flex-col items-center justify-center`;

if (!content.includes(startMarker) || !content.includes(endMarker)) {
    console.log('Markers not found!');
    process.exit(1);
}

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker) + endMarker.length - `            </>\n          ) : (\n            <div className="flex-1 flex flex-col items-center justify-center`.length;

const before = content.slice(0, startIndex);
const after = content.slice(endIndex);

const newForm = `                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2 relative w-full pt-1 pb-4 md:pb-2">
                    {/* Floating rounded composer container */}
                    <div className="flex-1 flex items-end bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800/80 rounded-[28px] shadow-sm relative min-h-[48px]">
                      
                      <input 
                         type="file" 
                         ref={fileInputRef} 
                         className="hidden" 
                         onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileSelection(e.target.files[0]);
                          }
                        }}
                      />

                      {/* Emoji trigger on the left */}
                      <div className="relative shrink-0 flex items-center justify-center h-[48px] w-[48px]">
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500 cursor-pointer transition-colors"
                          title="Pick emoji"
                        >
                          <Smile className="h-6 w-6" />
                        </button>
                        <AnimatePresence>
                          {showEmojiPicker && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute bottom-14 left-0 p-3 bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-[24px] shadow-xl w-64 z-30 flex flex-col gap-2.5 origin-bottom-left"
                            >
                              {/* Picker Tabs */}
                              <div className="flex border-b border-neutral-100 dark:border-zinc-900 text-[10px] font-bold">
                                {(['emoji', 'gif', 'sticker'] as const).map((tab) => (
                                  <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTabEmoji(tab)}
                                    className={\`flex-1 pb-1.5 uppercase text-center border-b-2 transition-all cursor-pointer \${
                                      activeTabEmoji === tab
                                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                                        : 'border-transparent text-neutral-400'
                                    }\`}
                                  >
                                    {tab}s
                                  </button>
                                ))}
                              </div>
                              
                              {/* Content based on selected tab */}
                              {activeTabEmoji === 'emoji' && (
                                <div className="grid grid-cols-6 gap-1.5 max-h-44 overflow-y-auto pt-1">
                                  {['😀','🔥','👍','🎉','🔒','🛡️','💻','🚀','💡','💬','💯','❤️','👏','🙌','😂','😮','😢','🙏'].map(emoji => (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={() => {
                                        setMessageText(prev => prev + emoji);
                                        setShowEmojiPicker(false);
                                        textInputRef.current?.focus();
                                      }}
                                      className="text-lg hover:scale-125 transition-transform cursor-pointer flex items-center justify-center p-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-900"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                              
                              {activeTabEmoji === 'gif' && (
                                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pt-1">
                                  {GIFS.map(gif => (
                                    <button
                                      key={gif.id}
                                      type="button"
                                      onClick={() => {
                                        chatStore.sendMessage({
                                          conversation_id: activeConv.id,
                                          sender_id: currentUser.id,
                                          text: \`Sent GIF: \${gif.name}\`,
                                          type: 'image',
                                          parent_message_id: replyingTo?.id,
                                          attachment: {
                                            id: \`gif-\${Math.random().toString(36).substring(2, 9)}\`,
                                            file_name: \`\${gif.name}.gif\`,
                                            file_size: 1048576,
                                            file_type: 'image/gif',
                                            file_url: gif.url
                                          }
                                        });
                                        setShowEmojiPicker(false);
                                      }}
                                      className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-zinc-800 hover:border-teal-500 transition-colors cursor-pointer group"
                                    >
                                      <img src={gif.url} alt={gif.name} className="h-16 w-full object-cover" />
                                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white py-0.5 truncate px-1 font-mono">{gif.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                              
                              {activeTabEmoji === 'sticker' && (
                                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pt-1">
                                  {STICKERS.map(st => (
                                    <button
                                      key={st.id}
                                      type="button"
                                      onClick={() => {
                                        chatStore.sendMessage({
                                          conversation_id: activeConv.id,
                                          sender_id: currentUser.id,
                                          text: \`Sent Sticker: \${st.name}\`,
                                          type: 'image',
                                          parent_message_id: replyingTo?.id,
                                          attachment: {
                                            id: \`sticker-\${Math.random().toString(36).substring(2, 9)}\`,
                                            file_name: \`\${st.name}.png\`,
                                            file_size: 204857,
                                            file_type: 'image/png',
                                            file_url: st.url
                                          }
                                        });
                                        setShowEmojiPicker(false);
                                      }}
                                      className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-zinc-800 hover:border-teal-500 transition-colors cursor-pointer"
                                    >
                                      <img src={st.url} alt={st.name} className="h-16 w-full object-cover" />
                                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white py-0.5 truncate px-1 font-mono">{st.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {isRecordingVoice ? (
                        <div className="flex-1 bg-red-500/10 dark:bg-red-500/15 rounded-xl my-1 mr-2 py-2.5 px-3 flex items-center justify-between text-xs animate-pulse select-none">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0" />
                            <span className="font-extrabold text-red-600 dark:text-red-400">{formatVoiceTime(voiceDuration)}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button type="button" onClick={() => stopVoiceRecording(false)} className="px-2 py-1 text-red-500 hover:bg-red-500/10 font-bold rounded-lg text-[10px] uppercase cursor-pointer">Cancel</button>
                            <button type="button" onClick={() => stopVoiceRecording(true)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-[14px] text-[10px] uppercase shadow-sm cursor-pointer">Send</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 min-w-0 relative flex items-center py-1">
                          <textarea
                            ref={textInputRef}
                            value={messageText}
                            onChange={(e) => {
                              setMessageText(e.target.value);
                              setIsTyping(true);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={editingMessage ? "Editing message shard..." : "Type a message..."}
                            className="w-full bg-transparent border-none py-2 text-sm focus:outline-none dark:text-white resize-none max-h-32 min-h-[36px] font-medium placeholder-neutral-400 dark:placeholder-zinc-500"
                            rows={1}
                          />
                          
                          {/* Staged edits save key indicator */}
                          {editingMessage && (
                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 mr-1 text-teal-500 hover:bg-teal-500/10 rounded-lg cursor-pointer font-bold text-[10px]"
                            >
                              Save
                            </button>
                          )}
                        </div>
                      )}

                      {/* Attachment trigger on the right inside composer */}
                      <div className="shrink-0 flex items-center justify-center h-[48px] w-[48px] mr-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500 cursor-pointer transition-colors"
                          title="Attach file"
                        >
                          <Paperclip className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    {/* Send or Voice Button - Floating right */}
                    <div className="shrink-0 flex items-center justify-center h-[48px] w-[48px]">
                      {messageText.trim().length > 0 ? (
                        <button
                          type="submit"
                          disabled={isRecordingVoice}
                          className="h-[48px] w-[48px] flex items-center justify-center rounded-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white shadow-md cursor-pointer transition-transform active:scale-95"
                        >
                          <Send className="h-5 w-5 ml-1" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={startVoiceRecording}
                          disabled={isRecordingVoice}
                          className="h-[48px] w-[48px] flex items-center justify-center rounded-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white shadow-md cursor-pointer transition-transform active:scale-95"
                        >
                          <Mic className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </>`;

fs.writeFileSync('src/components/ChatPlaceholder.tsx', before + newForm + after);
console.log('Update successful');
