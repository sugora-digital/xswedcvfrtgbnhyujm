const fs = require('fs');
let content = fs.readFileSync('src/lib/chatStore.ts', 'utf8');

const strToReplace = `  public updatePrivacySettings(userId: string, updated: Partial<UserPrivacySettings>) {
    const existingIdx = this.privacySettings.findIndex(ps => ps.user_id === userId);
    if (existingIdx !== -1) {
      this.privacySettings[existingIdx] = {
        ...this.privacySettings[existingIdx],
        ...updated
      };  public getProfiles() {
    return PROFILES;
  }


}`;

const newBlock = `  public updatePrivacySettings(userId: string, updated: Partial<UserPrivacySettings>) {
    const existingIdx = this.privacySettings.findIndex(ps => ps.user_id === userId);
    if (existingIdx !== -1) {
      this.privacySettings[existingIdx] = {
        ...this.privacySettings[existingIdx],
        ...updated
      };
    } else {
      this.privacySettings.push({
        user_id: userId,
        last_seen: 'everyone',
        online_status: 'everyone',
        read_receipts: true,
        who_can_message: 'everyone',
        ...updated
      });
    }
    this.saveToStorage(['privacySettings']);
    this.notifyListeners();
  }

  public getProfiles() {
    return PROFILES;
  }
}`;

content = content.replace(strToReplace, newBlock);
fs.writeFileSync('src/lib/chatStore.ts', content);
console.log("Fixed end block!");
