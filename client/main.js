navigator.mozSetMessageHandler('serviceworker-notification', function(activityRequest) {
  console.log('serviceworker-notification', activityRequest);
  if (window.navigator.mozApps) {
    var request = window.navigator.mozApps.getSelf();
    request.onsuccess = function() {
      if (request.result) {
        request.result.launch();
      }
    };
  } else {
    window.open(document.location.origin, '_blank');
  }
});


function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

let swRegistration = null;

const publicVapidKey = 'BEQKNRr93cvGQjWgT_7tYJ84J4-UZpZgfbd2pmom5ZRHoheLxZECOOu7112UV0b91R-l7UdhS07mRa-15FnfQVo'

const triggerPush = document.querySelector('.trigger-push')
const subscriptionDetails = document.getElementById('js-subscription-details')
subscriptionDetails.value = 'Hello'

function triggerPushNotification() {
  
  subscriptionDetails.value = 'Please wait'

  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  }).then(function(subscription) {
    return fetch('https://kai-push-notification.herokuapp.com/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        'subscription': subscription,
        'payload': {
          title: document.getElementById('title').value !== "" ? document.getElementById('title').value : 'Push Notification',
          body: document.getElementById('body').value !== "" ? document.getElementById('body').value : 'Push notifications with Service Workers',
        }
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
  .then(function(response) {
    response.json()
    .then(function(body) {
      subscriptionDetails.value =  JSON.stringify(body)
    })
    .catch(function(err) {
      subscriptionDetails.value =  err
    })
    
  })
  .catch(function(error) {
    subscriptionDetails.value =  error
    console.log(error)
  })
}

function nav (move) {
  const currentIndex = document.activeElement.tabIndex
  const next = currentIndex + move
  const nav = document.querySelectorAll('.nav')
  var targetElement = nav[next]
  if (targetElement !== undefined) {
    console.log(currentIndex)
    targetElement.focus()
  } else {
    targetElement = nav[0]
    targetElement.focus()
  }
}

function handleKeydown(e) {
  switch(e.key) {
    case 'ArrowUp':
      nav(-1)
      break
    case 'ArrowDown':
      nav(1)
      break
    //case 'ArrowRight':
      //nav(1)
      //break
    //case 'ArrowLeft':
      //nav(-1)
      //break
    case "SoftRight":
      document.activeElement.blur()
      break
    case "BrowserBack":
    case "Backspace":
      e.preventDefault()
      e.stopPropagation()
      if (document.activeElement.tagName === 'INPUT') {
        if (document.activeElement.value === '') {
          document.activeElement.blur()
        }
      } else if (document.activeElement.tagName === 'TEXTAREA') {
        document.activeElement.blur()
      } else {
        window.close()
      }
      break
    case "Call":
      triggerPushNotification()
      break
  }
}
document.activeElement.addEventListener('keydown', handleKeydown)

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('/sw.js')
  .then(function(swReg) {
    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
