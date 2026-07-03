const fs = require('fs');
let content = fs.readFileSync('src/lib/chatStore.ts', 'utf8');

const endOfClass = `  public getProfiles() {
    return PROFILES;
  }
}`;

const injectedPart = `  public isLoaded = false;
  
  public async loadFromIDB() {`;

// We need to cut the injected part from the end and put it inside the class
const splitIdx = content.indexOf('  public isLoaded = false;');

if (splitIdx !== -1) {
  let insideClass = content.slice(0, splitIdx);
  const theRest = content.slice(splitIdx);
  
  // Actually, the last method in the original file was `getProfiles() { return PROFILES; } }`
  // And it was at the end of insideClass.
  
  insideClass = insideClass.replace(endOfClass, '');
  
  const endExport = `\nexport const chatStore = new ChatStore();\n`;
  
  const newContent = insideClass + theRest.replace(endExport, '') + '\n' + endOfClass + endExport;
  fs.writeFileSync('src/lib/chatStore.ts', newContent);
  console.log("Moved methods inside class");
}
