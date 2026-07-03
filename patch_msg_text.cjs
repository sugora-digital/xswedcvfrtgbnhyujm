const fs = require('fs');

let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const oldText = `                            {/* Text content */}
                            <p className="text-xs leading-relaxed font-sans font-medium whitespace-pre-wrap select-text">
                              {msg.text}
                            </p>`;
                            
const newText = `                            {/* Text content */}
                            <p className="text-[14.5px] leading-snug font-sans whitespace-pre-wrap select-text mb-0.5">
                              {msg.text}
                            </p>`;

if (content.includes(oldText)) {
  content = content.replace(oldText, newText);
  fs.writeFileSync('src/components/ChatPlaceholder.tsx', content);
  console.log("Text patched");
} else {
  console.log("Text block not found");
}
