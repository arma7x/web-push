console.log('[SW] Push worker started')

self.addEventListener('push', function(event) {
  console.log('[SW] push')
  const data = event.data.json()
  self.registration.showNotification(data.title || 'Default Title', {
    body: data.body || 'Default notification body',
    requireInteraction: true,
    actions: [{
      action: "open",
      title: "Open"
    },{
      action: "ignore",
      title: "Ignore"
    }]
  });
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[SW] pushsubscriptionchange')
});

self.addEventListener('install', function(event) {
  console.log('[SW] install')
  self.skipWaiting()
});


self.addEventListener('activate', function(event) {
  self.skipWaiting()
  console.log('[SW] activate')
});

self.addEventListener('notificationclick', function(event) {
  console.log('[SW] notificationclick');
  event.notification.close();
  if (event.action === 'open') {
    event.waitUntil(clients.matchAll({
      type: "window"
    }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == '/' && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
      if (clients.openApp) {
        return clients.openApp();
      }
    }));
  }
});
