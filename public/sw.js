const CACHE_NAME = 'sugora-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/public/logo.svg',
  '/public/manifest.json'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell and static assets');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network first, falling back to cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and local assets
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If valid response, clone and cache it
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline: attempt to retrieve from cache
        console.log('[Service Worker] Offline fetch fallback for:', event.request.url);
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If indexing, return standard index shell as a fallback
          const acceptHeader = event.request.headers.get('accept');
          if (acceptHeader && acceptHeader.includes('text/html')) {
            return caches.match('/');
          }
        });
      })
  );
});

// PWA Notification Handlers
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Sugora Chat', body: event.data.text() };
    }
  }

  const title = data.title || 'Sugora';
  const options = {
    body: data.body || 'You have a new update',
    icon: data.icon || '/logo.svg',
    badge: '/logo.svg',
    vibrate: [100, 50, 100],
    data: data.data || { url: '/' },
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Custom action buttons handler
  if (event.action === 'accept-call') {
    // Handle incoming call accept
    const callId = event.notification.data?.callId;
    const urlToOpen = callId ? `/?action=accept-call&callId=${callId}` : '/';
    event.waitUntil(focusOrCreateWindow(urlToOpen));
    return;
  } else if (event.action === 'decline-call') {
    // Handle incoming call decline
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(focusOrCreateWindow(urlToOpen));
});

function focusOrCreateWindow(url) {
  return clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
    for (let client of windowClients) {
      if (client.url.includes(url) && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(url);
    }
  });
}
