const fs = require('fs');
let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const target = `              </div>
              
              {/* Mobile Nav */}`;

const replacement = `              </div>
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
              <h2 className="text-2xl font-bold tracking-tight mb-2">Sugora Core</h2>
              <p className="text-neutral-500 max-w-sm text-[15px]">Select a conversation or start a new connection to begin secure end-to-end messaging.</p>
            </div>
          )}
        </main>
        
        {/* Mobile Nav */}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/ChatPlaceholder.tsx', content);
  console.log("Restored main tags!");
} else {
  console.log("Target not found!");
}
