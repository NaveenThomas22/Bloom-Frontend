// Bloom PWA Push Notification Handler
self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'New alert from your Bloom CAT preparation sanctuary',
        icon: data.icon || '/icons/pwa-192x192.png',
        badge: data.badge || '/icons/pwa-192x192.png',
        vibrate: [100, 50, 100],
        data: data.data || { url: '/' },
      };
      event.waitUntil(self.registration.showNotification(data.title || 'Bloom — CAT Journey', options));
    } catch (e) {
      const text = event.data.text();
      event.waitUntil(
        self.registration.showNotification('Bloom — CAT Journey', {
          body: text,
          icon: '/icons/pwa-192x192.png',
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url && client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

