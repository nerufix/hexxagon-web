const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4 } = require('uuid')

var games = []

const defaultBoard = {
  red: [{q: 0, r: 4, s: -4}, {q: -4, r: 0, s: 4}, {q: 4, r: -4, s: 0}],
  blue: [{q: -4, r: 4, s: 0}, {q: 0, r: -4, s: 4}, {q: 4, r: 0, s: -4}]
}

const writeToJson = () => {
  fs.writeFile(__dirname+'/../data/games.json', JSON.stringify(games), 'utf8', () => {console.log('exported to json')});
}

const hexCompare = (hex1, hex2) => {
  return JSON.stringify(hex1) === JSON.stringify(hex2)
}

const includesHex = (hex, arr) => {
  return arr.map(el => JSON.stringify(el)).includes(JSON.stringify(hex))
}

fs.readFile(__dirname+'/../data/games.json', (err,content) => {
  if(err) throw err;
  games = JSON.parse(content)
})

//game create crud

router.post('/create', (req, res) => {
  const {name, player} = req.body
  if (!player) {
    res.status(418).send()
  } else {
    const newGame = {
      id: v4(),
      name: name || player,
      players: [player],
      turnCount: 0,
      board: defaultBoard,
      chat: []
    }
    games.push(newGame)
    writeToJson()
    res.send(newGame)
  }
})

router.put('/join/:id', (req, res) => {
  const player = req.body.player
  const id = req.params.id
  const query = games.findIndex(el => el.id===id)
  if (query<0 || !player) {
    res.status(418).send()
  } else {
    !games[query].players.includes(player) && games[query].players.length===1 && games[query].players.push(player)
    writeToJson()
    res.send(games[query]) 
  }
})

router.get('/list', (req, res) => {
  res.send(games.map(el => ({
    id: el.id,
    name: el.name,
    players: el.players
  })))
})

//delete after win



router.put('/chatMessage', (req, res) => {
  const {id, player, message} = req.body
  const query = games.findIndex(el => el.id===id)
  if (!player || query<0 || !message) {
    res.status(418).send()
  } else {
    games[query].chat.push({date: new Date(), player: player, message: message})
    games[query].chat.length>=30 && (games[query].chat = games[query].chat.slice(1,30))
    writeToJson()
    res.send()
  }
})


//move crud

router.post('/:id', (req, res) => {
  const {player, move} = req.body
  const id = req.params.id
  const query = games.findIndex(el => el.id===id)
  if (query<0 || !player || !games[query].players.includes(player)) {
    res.status(418).send()
  } else {
    const colors = games[query].players.findIndex(el => el === player) === 0 ? ['red', 'blue'] : ['blue', 'red']
    move.from && (games[query].board[colors[0]] = games[query].board[colors[0]].filter(el => !hexCompare(el, move.from)))
    games[query].board[colors[0]].push(...move.to)
    games[query].board[colors[1]] = games[query].board[colors[1]].filter(el => !includesHex(el, move.to))
    games[query].turnCount = move.turnCount
    writeToJson()
    res.send(games[query]) 
  }
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  const query = games.findIndex(el => el.id===id)
  if (query<0) {
    res.status(418).send()
  } else {
    res.send(games[query]) 
  }
})

//change color?
router.put('/:id', (req, res) => {
  const credentials = req.body
})

router.delete('/:id', (req, res) => {
  const credentials = req.body
})

module.exports = router;
