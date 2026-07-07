const fs = require('fs');
let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const topDiv = `  return (
    <div `;

const mainWorkspace = `{/* Main Workspace Frame */}`;
const flexContainer = `<div className="flex-1 flex overflow-hidden relative">`;

const startIdx = content.indexOf(topDiv);
const workspaceIdx = content.indexOf(mainWorkspace, startIdx);
const flexIdx = content.indexOf(flexContainer, workspaceIdx);

if (startIdx !== -1 && workspaceIdx !== -1 && flexIdx !== -1) {
  const endIdx = flexIdx + flexContainer.length;
  
  const newLayout = `  return (
    <div 
      className="h-screen bg-[#F8FAFC] dark:bg-[#09090B] text-slate-900 dark:text-neutral-50 flex flex-col md:flex-row transition-colors duration-300 select-none overflow-hidden"
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      {/* Left Navigation (Desktop) */}
      <nav className={\`hidden md:flex flex-col w-[260px] lg:w-[280px] bg-[#F8FAFC] dark:bg-[#09090B] shrink-0 border-r border-neutral-200/50 dark:border-zinc-800/50 h-full p-4 \${activeConv ? 'hidden md:flex' : 'flex'}\`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6C4EFF] via-[#7B61FF] to-[#00C8FF] p-[1px] shadow-sm">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-white dark:bg-zinc-900">
              <Sparkles className="h-4.5 w-4.5 text-[#7B61FF]" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Sugora
          </span>
        </div>

        {/* Nav Items */}
        <div className="flex-1 space-y-1.5 overflow-y-auto pr-2 scrollbar-thin">
          {[
            { id: 'chats', label: 'Chats', icon: MessageSquare, badge: filteredConversations.reduce((acc, c) => acc + c.unreadCount, 0) || null },
            { id: 'calls', label: 'Calls', icon: Phone },
            { id: 'contacts', label: 'Contacts', icon: Users },
            { id: 'groups', label: 'Groups', icon: Users },
            { id: 'starred', label: 'Starred', icon: Star },
            { id: 'archived', label: 'Archived', icon: Archive },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNavTab(item.id)}
              className={\`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer group \${
                activeNavTab === item.id 
                  ? 'bg-white dark:bg-zinc-900 shadow-sm border border-neutral-100 dark:border-zinc-800/50' 
                  : 'hover:bg-neutral-100/60 dark:hover:bg-zinc-900/40 text-neutral-500 dark:text-zinc-400 border border-transparent'
              }\`}
            >
              <div className="flex items-center gap-3">
                <div className={\`flex items-center justify-center h-8 w-8 rounded-xl transition-colors \${
                  activeNavTab === item.id 
                    ? 'bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 text-[#6C4EFF]' 
                    : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-zinc-300'
                }\`}>
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <span className={\`text-[15px] font-medium \${
                  activeNavTab === item.id ? 'text-neutral-900 dark:text-white font-semibold' : ''
                }\`}>
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="bg-[#6C4EFF] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          
          <div className="my-4 h-px bg-neutral-200/50 dark:bg-zinc-800/50 mx-4" />
          
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer group hover:bg-neutral-100/60 dark:hover:bg-zinc-900/40 text-neutral-500 dark:text-zinc-400"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-xl text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-zinc-300">
              <Settings className="h-4.5 w-4.5" />
            </div>
            <span className="text-[15px] font-medium">Settings</span>
          </button>
          <button
             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer group hover:bg-neutral-100/60 dark:hover:bg-zinc-900/40 text-neutral-500 dark:text-zinc-400"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-xl text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-zinc-300">
              <Info className="h-4.5 w-4.5" />
            </div>
            <span className="text-[15px] font-medium">Help & Support</span>
          </button>
        </div>

        {/* Bottom Profile Area */}
        <div className="mt-4 shrink-0 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800/50 p-3 shadow-sm flex items-center justify-between cursor-pointer group hover:border-neutral-300 dark:hover:border-zinc-700 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
             <div className="relative shrink-0">
                <div className="h-10 w-10 rounded-[14px] bg-gradient-to-tr from-[#6C4EFF]/20 to-[#00C8FF]/20 flex items-center justify-center">
                   <User className="h-5 w-5 text-[#6C4EFF]" />
                </div>
                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#10B981] border-2 border-white dark:border-zinc-900" />
             </div>
             <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                  {currentUser?.user_metadata?.display_name || username}
                </span>
                <span className="text-[11px] text-[#10B981] font-medium">Online</span>
             </div>
          </div>
          <button 
             onClick={handleSignOut}
             className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
             <LogOut className="h-4 w-4" />
          </button>
        </div>
        
        {/* Premium Banner */}
        <div className="mt-4 shrink-0 rounded-2xl bg-gradient-to-br from-[#6C4EFF] to-[#00C8FF] p-4 shadow-lg text-white relative overflow-hidden group cursor-pointer">
           <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:scale-110 transition-transform">
             <Sparkles className="h-12 w-12" />
           </div>
           <h4 className="font-bold text-sm mb-1 relative z-10">Sugora Premium</h4>
           <p className="text-[11px] text-white/80 mb-3 relative z-10 leading-snug">
             Unlock exclusive features and cloud storage.
           </p>
           <button className="w-full py-2 bg-white text-[#6C4EFF] rounded-xl text-xs font-bold shadow-sm hover:shadow transition-shadow">
             Upgrade Now
           </button>
        </div>
      </nav>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative bg-white dark:bg-zinc-950 md:rounded-l-[40px] md:border-l border-neutral-200/60 dark:border-zinc-800/60 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]">`;

  content = content.slice(0, startIdx) + newLayout + content.slice(endIdx);
  fs.writeFileSync('src/components/ChatPlaceholder.tsx', content);
  console.log("Layout patched successfully!");
} else {
  console.log("Could not find targets");
}
