const fs = require('fs');
let content = fs.readFileSync('src/lib/chatStore.ts', 'utf8');

const updatePrivacyStr = 'public updatePrivacySettings(userId: string, updated: Partial<UserPrivacySettings>) {';
const firstUpdatePrivacy = content.indexOf(updatePrivacyStr);

if (firstUpdatePrivacy === -1) {
  console.log("Could not find updatePrivacySettings");
  process.exit(1);
}

// Find the end of the first updatePrivacySettings
const endOfFirstUpdatePrivacy = content.indexOf('  }', firstUpdatePrivacy);

// The duplicate block starts right after this.
// Let's find getProfiles()
const getProfilesStr = '  public getProfiles() {';
const getProfilesIdx = content.indexOf(getProfilesStr);

if (getProfilesIdx === -1) {
    console.log("Could not find getProfiles");
    process.exit(1);
}

// Cut out everything between the end of the first updatePrivacySettings and getProfiles
const beforeCut = content.slice(0, endOfFirstUpdatePrivacy + 4);
const afterCut = content.slice(getProfilesIdx);

const newContent = beforeCut + afterCut;
fs.writeFileSync('src/lib/chatStore.ts', newContent);
console.log("Cut out duplicates!");
