const fs = require('fs');

let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const oldButton = `                    {/* Send or Voice Button - Floating right */}
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
                    </div>`;

const newButton = `                    {/* Send or Voice Button - Floating right */}
                    <div className="shrink-0 flex items-center justify-center h-[48px] w-[48px] relative overflow-hidden rounded-full bg-teal-500 shadow-md">
                      <AnimatePresence mode="wait" initial={false}>
                        {messageText.trim().length > 0 ? (
                          <motion.button
                            key="send"
                            type="submit"
                            initial={{ scale: 0, opacity: 0, rotate: -45 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0, rotate: 45 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            disabled={isRecordingVoice}
                            className="absolute inset-0 flex items-center justify-center bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white cursor-pointer"
                          >
                            <Send className="h-5 w-5 ml-1" />
                          </motion.button>
                        ) : (
                          <motion.button
                            key="mic"
                            type="button"
                            onClick={startVoiceRecording}
                            initial={{ scale: 0, opacity: 0, rotate: 45 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0, rotate: -45 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            disabled={isRecordingVoice}
                            className="absolute inset-0 flex items-center justify-center bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white cursor-pointer"
                          >
                            <Mic className="h-6 w-6" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>`;

if (content.includes(oldButton)) {
  fs.writeFileSync('src/components/ChatPlaceholder.tsx', content.replace(oldButton, newButton));
  console.log("Morph applied");
} else {
  console.log("Not found");
}
