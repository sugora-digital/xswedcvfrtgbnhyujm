const fs = require('fs');
let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const errorPart = `          ) : (
              {/* Search bar and Filters header */}`;

const fixedPart = `          ) : (
            <>
              {/* Search bar and Filters header */}`;

content = content.replace(errorPart, fixedPart);
fs.writeFileSync('src/components/ChatPlaceholder.tsx', content);
