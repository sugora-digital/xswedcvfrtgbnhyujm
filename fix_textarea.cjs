const fs = require('fs');

const content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

const hook = `
  // Auto-grow textarea
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.style.height = 'auto';
      textInputRef.current.style.height = \`\${Math.min(textInputRef.current.scrollHeight, 120)}px\`;
    }
  }, [messageText]);
`;

const importPopstate = `  // --- BROWSER NATIVE PUSH NOTIFICATIONS ---`;
if (!content.includes('Auto-grow textarea')) {
  fs.writeFileSync('src/components/ChatPlaceholder.tsx', content.replace(importPopstate, hook + importPopstate));
  console.log("Textarea fix applied");
} else {
  console.log("Already applied");
}
