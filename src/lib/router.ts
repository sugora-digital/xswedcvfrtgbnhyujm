import { useState, useEffect } from 'react';

// Simple event-emitter for navigation
const listeners = new Set<() => void>();

export function navigate(to: string) {
  window.history.pushState({}, '', to);
  listeners.forEach((listener) => listener());
}

export function usePath(): string {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    listeners.add(handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    // Patch pushState to emit changes
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      listeners.delete(handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return path;
}
