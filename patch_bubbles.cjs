const fs = require('fs');

let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const oldBubbleStart = `                          {/* Message bubble */}
                          <div className={\`p-3.5 rounded-2xl relative \${
                            isMe 
                              ? 'bg-neutral-900 dark:bg-white text-white dark:text-zinc-950 rounded-tr-xs shadow-xs' 
                              : 'bg-white dark:bg-zinc-950 border border-neutral-150 dark:border-zinc-850 rounded-tl-xs shadow-xs text-slate-800 dark:text-zinc-100'
                          }\`}>`;

const newBubbleStart = `                          {/* Message bubble */}
                          <div className={\`p-3 px-4 rounded-[20px] relative shadow-sm dark:shadow-none \${
                            isMe 
                              ? 'bg-teal-500 dark:bg-teal-600 text-white rounded-br-sm' 
                              : 'bg-white dark:bg-zinc-800/80 border border-neutral-100 dark:border-transparent rounded-bl-sm text-neutral-800 dark:text-zinc-100'
                          }\`}>`;

if (content.includes(oldBubbleStart)) {
  fs.writeFileSync('src/components/ChatPlaceholder.tsx', content.replace(oldBubbleStart, newBubbleStart));
  console.log("Bubbles updated");
} else {
  console.log("Could not find oldBubbleStart");
}
