const fs = require('fs');
let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const footerStart = `      {/* Mini Footer */}`;
const footerEnd = `      </footer>`;

const startIndex = content.indexOf(footerStart);
if (startIndex !== -1) {
  const endIndex = content.indexOf(footerEnd, startIndex);
  if (endIndex !== -1) {
    const before = content.slice(0, startIndex);
    const after = content.slice(endIndex + footerEnd.length);
    fs.writeFileSync('src/components/ChatPlaceholder.tsx', before + after);
    console.log("Footer removed");
  }
}
