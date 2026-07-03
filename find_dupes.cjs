const fs = require('fs');
const content = fs.readFileSync('src/lib/chatStore.ts', 'utf8');

const match1 = content.indexOf('public sendMessage(args: {');
const match2 = content.indexOf('public sendMessage(args: {', match1 + 1);

console.log('sendMessage 1:', match1);
console.log('sendMessage 2:', match2);

const getProfiles1 = content.indexOf('public getProfiles()');
const getProfiles2 = content.indexOf('public getProfiles()', getProfiles1 + 1);

console.log('getProfiles 1:', getProfiles1);
console.log('getProfiles 2:', getProfiles2);
