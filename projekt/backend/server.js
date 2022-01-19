const express = require('express')
const cors = require('cors');
const mqttServer = require('./mqtt')
const games = require('./routes/gamesRoute')
const users = require('./routes/usersRoute')
const app = express()
const port = 5000

app.use(express.json())
app.use(cors());
app.use('/games', games)
app.use('/users', users)

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})

