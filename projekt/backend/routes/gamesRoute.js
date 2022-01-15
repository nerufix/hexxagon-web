const express = require('express');
const router = express.Router();
const fs = require('fs');

var games = []

//fs.writeFile('myjsonfile.json', JSON.stringify(data), 'utf8', () => {console.log('exported to json')});
fs.readFile(__dirname+'/../data/games.json', (err,content) => {
  if(err) throw err;
  games = JSON.parse(content)
})

router.get('/', (req, res) => {
  res.send(games)
})

module.exports = router;
