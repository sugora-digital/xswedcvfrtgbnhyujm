const fs = require('fs');
let content = fs.readFileSync('src/lib/chatStore.ts', 'utf8');

const importStatement = `import { getRealSupabaseClient } from './supabase';\nimport { get, set } from 'idb-keyval';`;

const lastImport = content.lastIndexOf(importStatement);
if (lastImport !== -1 && lastImport > 100) {
  content = content.slice(0, 100) + content.slice(lastImport);
  fs.writeFileSync('src/lib/chatStore.ts', content);
  console.log("Recovered chatStore, length:", content.length);
} else {
  console.log("Could not find boundary", lastImport);
}
