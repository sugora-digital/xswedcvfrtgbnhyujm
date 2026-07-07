const fs = require('fs');
let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const regex = /{activeTab === 'calls' \? \([\s\S]*?\) : filteredConversations\.length === 0 \? \(/;

content = content.replace(regex, `{filteredConversations.length === 0 ? (`);

fs.writeFileSync('src/components/ChatPlaceholder.tsx', content);
console.log("Removed calls block from chat list");
