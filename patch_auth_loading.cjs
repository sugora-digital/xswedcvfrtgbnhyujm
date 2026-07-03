const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldCheckAuth = `    async function checkAuth() {
      try {
        const { data } = await supabaseClient.auth.getSession();
        if (data?.session?.user) {
          const user = data.session.user;
          setCurrentUser(user);
          
          try {
            const role = await ensureUserProfile(user);
            setUserRole(role);
          } catch (e) {
            console.error('ensureUserProfile error:', e);
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setAuthLoading(false);
      }
    }`;

const newCheckAuth = `    async function checkAuth() {
      try {
        const { data } = await supabaseClient.auth.getSession();
        if (data?.session?.user) {
          const user = data.session.user;
          setCurrentUser(user);
          
          // Try to load cached role from localStorage for instant boot
          const cachedRole = localStorage.getItem('sugora_cached_role');
          if (cachedRole) {
            setUserRole(cachedRole);
            setAuthLoading(false); // unblock instantly
          }
          
          // Do network request in background
          ensureUserProfile(user).then(role => {
            setUserRole(role);
            localStorage.setItem('sugora_cached_role', role);
            if (!cachedRole) setAuthLoading(false);
          }).catch(e => {
            console.error('ensureUserProfile error:', e);
            if (!cachedRole) setAuthLoading(false);
          });
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setAuthLoading(false);
        }
      } catch (err) {
        console.error(err);
        setAuthLoading(false);
      }
    }`;

if (content.includes(oldCheckAuth)) {
  content = content.replace(oldCheckAuth, newCheckAuth);
  fs.writeFileSync('src/App.tsx', content);
  console.log("checkAuth patched");
} else {
  console.log("Could not find checkAuth");
}
