const express = require('express');
const router = express.Router();
const fs = require('fs');

var ads = []
var admins = []

const writeToJson = () => {
  fs.writeFile(__dirname+'/../data/ads.json', JSON.stringify(ads), 'utf8', () => {console.log('exported ads to json')});
}

fs.readFile(__dirname+'/../data/ads.json', (err,content) => {
  if(err) throw err;
  ads = JSON.parse(content)
})

fs.readFile(__dirname+'/../data/users.json', (err,content) => {
  if(err) throw err;
  admins = JSON.parse(content).filter(el => el.role==='admin').map(el => el.login)
})

const adminCheck = (login) => {
  return admins.includes(login)
}



router.get('/', (req, res) => {
  adminCheck(req.query.login) ? res.send(ads) : res.status(418).send({})
})

router.post('/', (req, res) => {
  if (!adminCheck(req.query.login) || !req.body.url) {
    res.status(418).send({})
  } else {
    const url = req.body.url
    ads.push(url)
    writeToJson()
    res.send(ads)
  }
})

router.put('/', (req, res) => {
  const {oldUrl, newUrl} = req.body
  const query = ads.findIndex(el => el === oldUrl)
  if (!adminCheck(req.query.login) || query<0 || !newUrl) {
    res.status(418).send({})
  } else {
    ads.splice(query, 1, newUrl)
    writeToJson()
    res.send(ads)
  }
})

router.delete('/', (req, res) => {
  const url = req.body.url
  const query = ads.findIndex(el => el === url)
  if (!adminCheck(req.query.login) || query<0) {
    res.status(418).send({})
  } else {
    ads.splice(query, 1)
    writeToJson()
    res.send(ads)
  }
})

module.exports = router;
