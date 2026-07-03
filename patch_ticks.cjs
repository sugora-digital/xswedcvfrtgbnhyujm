const fs = require('fs');
let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const oldTicks = `                              {/* WhatsApp style double ticks */}
                              {isMe && (
                                <span>
                                  {msg.status === 'sent' && <Check className="h-3 w-3 text-neutral-400" />}
                                  {msg.status === 'delivered' && <CheckCheck className="h-3 w-3 text-neutral-400" />}
                                  {msg.status === 'read' && <CheckCheck className="h-3 w-3 text-teal-500 dark:text-teal-400" />}
                                </span>
                              )}`;

const newTicks = `                              {/* WhatsApp style double ticks */}
                              {isMe && (
                                <span className="ml-0.5">
                                  {msg.status === 'sent' && <Check className="h-3.5 w-3.5 text-white/70" />}
                                  {msg.status === 'delivered' && <CheckCheck className="h-3.5 w-3.5 text-white/70" />}
                                  {msg.status === 'read' && <CheckCheck className="h-3.5 w-3.5 text-blue-300" />}
                                </span>
                              )}`;

if (content.includes(oldTicks)) {
  content = content.replace(oldTicks, newTicks);
  fs.writeFileSync('src/components/ChatPlaceholder.tsx', content);
  console.log("Ticks patched");
} else {
  console.log("Ticks not found");
}
