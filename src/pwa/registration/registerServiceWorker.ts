import { registerSW } from 'virtual:pwa-register';

export function setupServiceWorker() {
  if ('serviceWorker' in navigator && !import.meta.env.DEV) {
    const updateSW = registerSW({
      onNeedRefresh() {
        console.log('New Bloom version available.');
        if (confirm('A gentle update is available for Bloom. Refresh now?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('Bloom is ready for offline study.');
      },
    });
  }
}

