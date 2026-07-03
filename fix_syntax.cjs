const fs = require('fs');

let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');
content = content.replace("                  </div>hatSettings } from '../lib/chatStore';", "                  </div>\n                )}\n              </div>\n            )}");
fs.writeFileSync('src/components/ChatPlaceholder.tsx', content);
