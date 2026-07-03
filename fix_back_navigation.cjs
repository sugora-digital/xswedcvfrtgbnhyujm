const fs = require('fs');

let content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

// Insert a useEffect block near the top of ChatPlaceholder to handle history pushState when activeConv changes
const importPopstate = `  // --- BROWSER NATIVE PUSH NOTIFICATIONS ---`;
const pushStateHook = `
  // --- MOBILE BACK NAVIGATION ---
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // If we are in a conversation and user presses back, close the conversation instead of navigating away.
      if (activeConv) {
        e.preventDefault();
        setActiveConv(null);
        // We pushed state when entering conv, so popping goes back to the chat list (which is /chat)
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeConv]);

  // Push state when entering a conversation
  useEffect(() => {
    if (activeConv) {
      window.history.pushState({ chat: activeConv.id }, '', '/chat');
    }
  }, [activeConv?.id]);

`;

if (content.includes('MOBILE BACK NAVIGATION')) {
   console.log('Already patched popstate');
} else {
   content = content.replace(importPopstate, pushStateHook + importPopstate);
   fs.writeFileSync('src/components/ChatPlaceholder.tsx', content);
   console.log('Popstate patched');
}
