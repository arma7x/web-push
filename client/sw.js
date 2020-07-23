self.addEventListener('push', function(event) {
  const data = event.data.json()
  self.registration.showNotification(data.title || 'Default Title', {
    body: data.body || 'Default notification body',
  });
});

self.addEventListener('pushsubscriptionchange', function(event) {
  //console.dir('pushsubscriptionchange', event)
  //self.registration.showNotification('pushsubscriptionchange', {
  //  body: 'This is pushsubscriptionchange',
  //});
});

self.addEventListener('install', function(event) {
  //console.dir('install', event)
  self.skipWaiting()
  //self.registration.showNotification('install', {
    //body: 'This is install',
  //});
});


self.addEventListener('activate', function(event) {
  //self.skipWaiting()
  //console.dir('activate', event)
  //self.registration.showNotification('activate', {
  //  body: 'This is activate',
  //});
});
