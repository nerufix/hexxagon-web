const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4 } = require('uuid')

var users = []
var logs = []

const writeToJson = () => {
  fs.writeFile(__dirname+'/../data/users.json', JSON.stringify(users), 'utf8', () => {console.log('exported users to json')});
}

fs.readFile(__dirname+'/../data/users.json', (err,content) => {
  if(err) throw err;
  users = JSON.parse(content)
})

//SCORE

router.put('/score', (req, res) => {
  const {player, score} = req.body
  const query = users.findIndex(el => el.login === player)
  if (query<0 || !player || !score) {
    res.status(418).send()
  } else {
    users[query].score += parseInt(score) 
    writeToJson()
    res.send({score: users[query].score})
  }
})

router.get('/scoreboard', (req, res) => {
  const query = users.map(el => ({player: el.login, score: el.score})).sort((a,b) => {
    return b.score-a.score
  }).slice(0,10)
  res.send(query)
})

router.put('/admin', (req, res) => {
  const { admin, newAdmin } = req.body
  console.log(req.body)
  const adminQuery = users.findIndex(el => el.login === admin)
  const newAdminQuery = users.findIndex(el => el.login === newAdmin)
  if (adminQuery<0 || newAdminQuery<0 || users[adminQuery].role!=='admin') {
    res.status(418).send()
  } else {
    users[newAdminQuery].role='admin'
    writeToJson()
    res.send()
  }
})

router.get('/logs', (req, res) => {
  const { date, data } = req.query
  fs.readFile(__dirname+'/../data/log.txt', "utf8", (err,content) => {
    if(err) throw err
    const query = content.split('\n').map(el => ({
      date: el.split(': ')[0],
      data: el.split(': ').slice(1).join(': ')
    }))
    const dateFilter = date ? query.filter(el => el.date.slice(0,10)===date) : query
    const dataFilter = data ? dateFilter.filter(el => el.data.includes(data)) : dateFilter
    res.send(date || data ? dataFilter : query.slice(-20, -1).reverse())
  })
})

//account crud

router.post('/login', (req, res) => {
  const credentials = req.body
  const query = users.find(el => 
    (el.login === credentials.login && el.password === credentials.password)
    || (el.token && credentials.token === el.token.value && new Date(el.token.due) > new Date())
  )
  if (!query) {
    res.status(418).send(credentials.login ? {message: 'Wrong credentials!'} : {})
  } else if (credentials.remember) {
    const token = {
      value: v4(),
      due: new Date(Date.now() + ( 3600 * 1000 * 24))
    }
    users[users.findIndex(el => el === query)].token = token
    writeToJson()
    res.send({ login: query.login, score: query.score, role: query.role, token: token.value })
  } else {
    res.send({ login: query.login, score: query.score, role: query.role })
  }
})

router.post('/register', (req, res) => {
  const credentials = req.body
  const existingUser = users.find(el => el.login===credentials.login)
  if (!existingUser && credentials.login && credentials.password.length === 64) {
    users.push({
      login: credentials.login,
      password: credentials.password,
      role: 'user',
      score: 0
    })
    writeToJson()
    res.send({})
  } else {
    res.status(418).send({message: 'Username already taken!'})
  }
})

router.get('/', (req, res) => {
  res.send(users.map(el => el.login))
})

router.put('/', (req, res) => {
  const {newPassword, ...credentials} = req.body
  const query = users.findIndex(el => el.login === credentials.login && el.password === credentials.password)
  if (query<0 || newPassword.length !== 64) {
    res.status(418).send({message: 'Wrong password!'})
  } else {
    users[query].password = newPassword
    writeToJson()
    res.send()
  }
})

router.delete('/', (req, res) => {
  const credentials = req.body
  const query = users.findIndex(el => el.login === credentials.login && el.password === credentials.password)
  if (query<0) {
    res.status(418).send({message: 'Wrong password!'})
  } else {
    users.splice(query, 1)
    writeToJson()
    res.send()
  }
})

module.exports = router;

