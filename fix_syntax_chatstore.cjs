const fs = require('fs');
let content = fs.readFileSync('src/lib/chatStore.ts', 'utf8');

const badPart = `export const chatStore = new ChatStore();
  public isLoaded = false;
  
  public async loadFromIDB() {`;

const goodPart = `  public isLoaded = false;
  
  public async loadFromIDB() {`;

if (content.includes(badPart)) {
  content = content.replace(badPart, goodPart);
  content += '\nexport const chatStore = new ChatStore();\n';
  fs.writeFileSync('src/lib/chatStore.ts', content);
  console.log('Fixed syntax in chatStore.ts');
} else {
  console.log('Bad part not found');
}
