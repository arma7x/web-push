require('dotenv').config({ path: 'variables.env' })

const express = require('express')
const webPush = require('web-push')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(cors())

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'client')))

const subject = 'mailto:ahmadmuhamad101@gmail.com'
const publicVapidKey = process.env.PUBLIC_VAPID_KEY
const privateVapidKey = process.env.PRIVATE_VAPID_KEY

app.post('/subscribe', (req, res) => {

  const body = req.body

  const encoding = body.encoding ? body.encoding : 'aesgcm'

  const payload = body.payload ? JSON.stringify(body.payload) : JSON.stringify({
    title: 'Push Notification',
    body: 'Push notifications with Service Workers',
  })

  webPush.setVapidDetails(subject, publicVapidKey, privateVapidKey)

  setTimeout(() => {
    webPush.sendNotification(body.subscription, payload, {contentEncoding: encoding})
    .then((success) => {
      console.log(success)
      res.status(success.statusCode).json(success)
    })
    .catch((error) => {
      res.status(error.statusCode).json(error)
    })
  }, 3000)
})

app.post('/push', (req, res) => {

  const body = req.body

  const publicVapidKey = body.publicVapidKey

  const privateVapidKey = body.privateVapidKey

  const encoding = body.encoding ? body.encoding : 'aesgcm'

  const payload = body.payload ? JSON.stringify(body.payload) : JSON.stringify({
    title: 'Push Notification',
    body: 'Push notifications with Service Workers',
  })

  webPush.setVapidDetails(subject, publicVapidKey, privateVapidKey)

  webPush.sendNotification(body.subscription, payload, {contentEncoding: encoding})
  .then((success) => {
    console.log(success)
    res.status(success.statusCode).json(success)
  })
  .catch((error) => {
    res.status(error.statusCode).json(error)
  })
})

app.set('port', process.env.PORT || 5000)
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`)
})
