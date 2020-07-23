require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')

const app = express();

app.use(cors())

app.use(cors())

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client')));

const subject = 'mailto:test@example.com';
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails(subject, publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {

  const body = req.body

  const payload = req.body.payload ? JSON.stringify(req.body.payload) : JSON.stringify({
    title: 'Push Notification',
    body: 'Push notifications with Service Workers',
  });

  setTimeout(() => {
    webPush.sendNotification(body.subscription, payload, {contentEncoding: 'aesgcm'})
    .then((success) => {
      console.log(success);
      res.status(success.statusCode).json(success)
    })
    .catch((error) => {
      console.log('Subscription', body.subscription)
      console.log('RequestDetails', webPush.generateRequestDetails(body.subscription, payload, {contentEncoding: 'aesgcm'}));
      console.log('Error', error);
      res.status(error.statusCode).json(error)
    });
  }, 3000);
});

app.set('port', process.env.PORT || 5000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
