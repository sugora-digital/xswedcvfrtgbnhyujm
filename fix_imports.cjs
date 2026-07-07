const fs = require('fs');

let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const importMatch = content.match(/import \{([^}]+)\} from 'lucide-react';/);
if (importMatch) {
  const imports = importMatch[1].split(',').map(s => s.trim());
  const uniqueImports = [...new Set(imports)].filter(Boolean);
  content = content.replace(importMatch[0], "import { " + uniqueImports.join(', ') + " } from 'lucide-react';");
  fs.writeFileSync('src/components/ChatPlaceholder.tsx', content);
  console.log("Imports deduplicated");
}
