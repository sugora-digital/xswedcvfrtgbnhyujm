import React, { useState, useEffect } from 'react';
import { Phone, Video, Search, PhoneMissed, PhoneIncoming, PhoneOutgoing, Trash2 } from 'lucide-react';
import { callingStore } from '../../../lib/callingStore';
import { chatStore } from '../../../lib/chatStore';

export const CallsPanel = ({ currentUser }: { currentUser: any }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'missed' | 'voice' | 'video'>('all');
  const [callHistory, setCallHistory] = useState(callingStore.getCallHistory());

  useEffect(() => {
    const unsub = callingStore.subscribe(() => {
      setCallHistory(callingStore.getCallHistory());
    });
    return () => unsub();
  }, []);

  const filteredCalls = callHistory.filter(call => {
    if (filter === 'missed' && call.status !== 'missed') return false;
    if (filter === 'voice' && call.type !== 'voice') return false;
    if (filter === 'video' && call.type !== 'video') return false;
    
    if (searchQuery) {
      const otherUserId = call.caller_id === currentUser?.id ? call.receiver_id : call.caller_id;
      const otherUser = chatStore.getProfiles().find(p => p.id === otherUserId);
      const name = otherUser?.display_name || otherUser?.username || '';
      if (!name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]/50 dark:bg-[#09090B]/50">
      <div className="p-4 space-y-4 shrink-0 border-b border-neutral-200/50 dark:border-zinc-800/50 relative z-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Calls</h2>
          <button onClick={() => callingStore.clearHistory()} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 text-red-500 transition-colors" title="Clear Call Log">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400 group-focus-within:text-[#6C4EFF] transition-colors" />
            <input 
              type="text" 
              placeholder="Search calls..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 rounded-[20px] text-[14px] focus:outline-none border border-neutral-200/60 dark:border-zinc-800/60 focus:border-[#6C4EFF]/50 focus:ring-4 focus:ring-[#6C4EFF]/10 transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto scrollbar-none mt-3">
          {['all', 'missed', 'voice', 'video'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-3.5 py-1.5 text-[13px] font-bold capitalize transition-all rounded-[14px] flex-shrink-0 ${
                filter === tab 
                  ? 'bg-[#6C4EFF]/10 dark:bg-[#7B61FF]/15 text-[#6C4EFF] dark:text-[#7B61FF] border border-[#6C4EFF]/20' 
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-zinc-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {filteredCalls.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <Phone className="h-8 w-8 text-neutral-350 dark:text-zinc-700 mx-auto" />
            <p className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">No call records</p>
          </div>
        ) : (
          filteredCalls.map((call) => {
            const otherUserId = call.caller_id === currentUser?.id ? call.receiver_id : call.caller_id;
            const otherUser = chatStore.getProfiles().find(p => p.id === otherUserId);
            const isIncoming = call.receiver_id === currentUser?.id;
            const isVideo = call.type === 'video';
            const name = otherUser?.display_name || otherUser?.username || 'Unknown';
            const isMissed = call.status === 'missed';

            return (
              <div
                key={call.id}
                className="flex items-center justify-between p-3 rounded-[20px] hover:bg-white dark:hover:bg-zinc-900 transition-all select-none border border-transparent hover:border-neutral-100 hover:shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-11 w-11 rounded-full bg-neutral-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center font-bold text-neutral-500 shrink-0">
                    {otherUser?.avatar ? (
                      <img src={otherUser.avatar} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`font-bold text-[15px] truncate ${isMissed ? 'text-red-500' : 'text-neutral-900 dark:text-white'}`}>
                      {name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium mt-0.5">
                      {isMissed ? <PhoneMissed className="h-3.5 w-3.5 text-red-500" /> : isIncoming ? <PhoneIncoming className="h-3.5 w-3.5 text-emerald-500" /> : <PhoneOutgoing className="h-3.5 w-3.5 text-blue-500" />}
                      <span>{new Date(call.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {call.duration_seconds > 0 && (
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
                      className="p-2 rounded-full bg-neutral-100 hover:bg-[#6C4EFF] hover:text-white dark:bg-zinc-800 text-neutral-500 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => callingStore.startCall(otherUser, 'video')}
                      className="p-2 rounded-full bg-neutral-100 hover:bg-[#6C4EFF] hover:text-white dark:bg-zinc-800 text-neutral-500 transition-colors"
                    >
                      <Video className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
