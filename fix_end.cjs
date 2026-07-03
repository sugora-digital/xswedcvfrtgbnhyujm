const fs = require('fs');
let content = fs.readFileSync('src/lib/chatStore.ts', 'utf8');

const target = `  public getProfiles() {
    return PROFILES;
  }
}

export const chatStore = new ChatStore();

  public getProfiles() {
    return PROFILES;
  }
}
export const chatStore = new ChatStore();
`;

const replaceWith = `  public getProfiles() {
    return PROFILES;
  }
}

export const chatStore = new ChatStore();
`;

// It might have weird spacing so let's just do a substring search from the end
const idx = content.lastIndexOf('  public getProfiles() {');
if (idx !== -1) {
    const startIdx = content.lastIndexOf('  public getProfiles() {', idx - 1);
    if (startIdx !== -1) {
        content = content.slice(0, startIdx) + replaceWith;
        fs.writeFileSync('src/lib/chatStore.ts', content);
        console.log("Fixed ending");
    } else {
        console.log("Could not find two getProfiles");
    }
}
