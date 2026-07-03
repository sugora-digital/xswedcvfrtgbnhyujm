const fs = require('fs');

let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const oldSync = `    // Trigger persistent cloud storage synchronization
    chatStore.syncWithSupabase(currentUser.id);`;

const newSync = `    // Trigger offline fast boot, then cloud sync
    if (!chatStore.isLoaded) {
      chatStore.loadFromIDB().then(() => {
        chatStore.syncWithSupabase(currentUser.id);
      });
    } else {
      chatStore.syncWithSupabase(currentUser.id);
    }`;

content = content.replace(oldSync, newSync);
fs.writeFileSync('src/components/ChatPlaceholder.tsx', content);
console.log('Sync patched');
