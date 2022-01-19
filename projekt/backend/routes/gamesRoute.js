const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4 } = require('uuid')

var games = []

const defaultBoard = [...Array(81).keys()].map(el => {
  if ([0,1,2,6,7,8,9,17,31,39,41,63,64,70,71,72,73,74,75,77,78,79,80].includes(el)) {
    return 3
  } else {
    return 0
  }
})

const writeToJson = () => {
  fs.writeFile(__dirname+'/../data/games.json', JSON.stringify(games), 'utf8', () => {console.log('exported to json')});
}

fs.readFile(__dirname+'/../data/games.json', (err,content) => {
  if(err) throw err;
  games = JSON.parse(content)
})

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


//game crud

router.post('/:id', (req, res) => {
  const {player, move} = req.body
  const id = req.params.id
  const query = games.findIndex(el => el.id===id)
  if (query<0 || !player || !query.players.includes(player) || games[query].board[move]!==0) {
    res.status(418).send()
  } else {
    games[query].board[move] = games[query].players.findIndex(player)+1
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

router.put('/:id', (req, res) => {
  const credentials = req.body
})

router.delete('/:id', (req, res) => {
  const credentials = req.body
})

module.exports = router;
