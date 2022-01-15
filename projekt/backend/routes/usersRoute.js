const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4 } = require('uuid')

var users = []

const writeToJson = () => {
  fs.writeFile(__dirname+'/../data/users.json', JSON.stringify(users), 'utf8', () => {console.log('exported to json')});
}

//fs.writeFile('myjsonfile.json', JSON.stringify(data), 'utf8', () => {console.log('exported to json')});
fs.readFile(__dirname+'/../data/users.json', (err,content) => {
  if(err) throw err;
  users = JSON.parse(content)
})

router.post('/login', (req, res) => {
  const credentials = req.body
  const query = users.find(el => 
    (el.login === credentials.login && el.password === credentials.password)
    || (el.token && credentials.token === el.token.value && el.token.due > Date.now())
  )
  if (!query) {
    res.status(418).send({})
  } else if (credentials.remember) {
    const token = {
      value: v4(),
      due: new Date(Date.now() + ( 3600 * 1000 * 24))
    }
    users[users.findIndex(el => el === query)].token = token
    writeToJson()
    res.send({ login: query.login, role: query.role, token: token.value })
  } else {
    res.send({ login: query.login, role: query.role })
  }
})

router.post('/register', (req, res) => {
  const credentials = req.body
  if (credentials.login && credentials.password.length === 64) {
    users.push({
      login: credentials.login,
      password: credentials.password,
      role: 'user'
    })
    writeToJson()
    res.send({})
  } else {
    res.status(418).send({})
  }
})

module.exports = router;
