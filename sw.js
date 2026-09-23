// Service Worker per notifiche in background - Hydration Manager

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Ascolta i messaggi inviati dalla scheda principale
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const delay = event.data.delayMs;
    const title = event.data.title;
    const body = event.data.body;
    const icon = event.data.icon;

    // Programma la notifica al tempo esatto
    setTimeout(() => {
      self.registration.showNotification(title, {
        body: body,
        icon: icon || 'https://cdn-icons-png.flaticon.com/512/3105/3105807.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3105/3105807.png',
        requireInteraction: true,
        vibrate: [200, 100, 200]
      });
    }, delay);
  }
});

// Clic sulla notifica: riapre o porta in primo piano la scheda
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
