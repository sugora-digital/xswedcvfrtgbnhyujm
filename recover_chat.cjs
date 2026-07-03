const fs = require('fs');

const content = fs.readFileSync('src/components/ChatPlaceholder.tsx', 'utf8');

// The original file is from line 1-5, plus the content starting at `import {\n  LogOut`
const startOfImports = `import { 
  LogOut`;

const secondHalfIndex = content.lastIndexOf(startOfImports);

if (secondHalfIndex !== -1 && secondHalfIndex > 1000) {
  const lines1to5 = `import React, { useEffect, useState, useRef } from 'react';
import { supabaseClient } from '../lib/supabase';
import { navigate } from '../lib/router';
import { useTheme } from './ThemeContext';
import { chatStore, ChatMessage, Conversation, ChatSettings } from '../lib/chatStore';
`;
  
  const recovered = lines1to5 + content.slice(secondHalfIndex);
  fs.writeFileSync('src/components/ChatPlaceholder.tsx', recovered);
  console.log("Recovered successfully. Length:", recovered.length);
} else {
  console.log("Could not find boundary", secondHalfIndex);
}
