console.log('[SW] Push worker started')

self.addEventListener('push', function(event) {
  console.log('[SW] push')
  const data = event.data.json()
  self.registration.showNotification(data.title || 'Default Title', {
    body: data.body || 'Default notification body',
  });
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[SW] pushsubscriptionchange')
  //self.registration.showNotification('pushsubscriptionchange', {
  //  body: 'This is pushsubscriptionchange',
  //});
});

self.addEventListener('install', function(event) {
  console.log('[SW] install')
  self.skipWaiting()
  //self.registration.showNotification('install', {
    //body: 'This is install',
  //});
});


self.addEventListener('activate', function(event) {
  self.skipWaiting()
  console.log('[SW] activate')
  //self.registration.showNotification('activate', {
  //  body: 'This is activate',
  //});
});

self.addEventListener('notificationclick', function(event) {
  console.log('[SW] notificationclick');
  event.notification.close();
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
});
