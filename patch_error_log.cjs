const fs = require('fs');
let content = fs.readFileSync('src/lib/chatStore.ts', 'utf8');
content = content.replace(
  "if (error) console.error('Supabase message insert error:', error);",
  "if (error) console.error('Supabase message insert error:', JSON.stringify(error));"
);
fs.writeFileSync('src/lib/chatStore.ts', content);
