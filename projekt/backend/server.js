const express = require('express')
const cors = require('cors');
const games = require('./routes/gamesRoute')
const users = require('./routes/usersRoute')
const app = express()
const port = 5000

app.use(express.json())
app.use(cors());
/*
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
*/
app.use('/games', games)
app.use('/users', users)

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})
