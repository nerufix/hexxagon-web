const express = require('express')
const cors = require('cors');
const mqttServer = require('./mqtt') //required
const sseServer = require('./sse')
const games = require('./routes/gamesRoute')
const users = require('./routes/usersRoute')
const ads = require('./routes/adsRoute')
const app = express()
const port = 5000
const path = require('path')
var fs = require('fs')

app.use(express.json())
app.use((req, res, next) => {
  var logStream = fs.createWriteStream(__dirname+'/data/log.txt', {flags: 'a'});
  logStream.write(
    `${new Date().toISOString()}: \
    http request ${req.method}:${req.url},\
    body: ${JSON.stringify(req.body)},\
    status ${res.statusCode}\n`
  )
  logStream.end()
  next();
})
app.use(cors());
app.use('/games', games)
app.use('/users', users)
app.use('/ads', ads)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})

