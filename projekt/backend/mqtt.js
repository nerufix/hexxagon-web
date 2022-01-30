const mosca = require('mosca')

const fs = require('fs')

const settings = {
  port: 1883,
  http: {port: 3333, bundle: true, static: './'}  
}

const server = new mosca.Server(settings);

const playerLocation = {
  game: [],
  lobby: []
}

const publish = (topic, message) => {
  server.publish({topic: topic, payload: message, qos: 2, retain: false})
}

server.on('ready', () => {
  console.log(`Mosca embedded MQTT broker running at port ${settings.http.port}`)
})

server.on('clientConnected', (client) => {
  console.log('client connected', client.id);
})
/*
server.on('published', (packet) => {
  console.log('Published', JSON.stringify(packet));
})
*/
server.subscribe('#', (topic, payload) => {
  const logStream = fs.createWriteStream(__dirname+'/data/log.txt', {flags: 'a'});
  logStream.write(new Date().toISOString()+`: mqtt published on ${topic}, data: ${payload}\n`)
  logStream.end()
  const pl = payload[0] === '{' ? JSON.parse(payload) : {}
  if (!pl.topic || !pl.clientId) {

  } else if (topic.includes('/subscribes') && pl.topic.includes('chat')) {
    publish(pl.topic, JSON.stringify({
      date: Date.now(),
      player: pl.clientId.split('_0.')[0],
      message: 'connected to the chat'
    }))
    playerLocation.game.push(pl.clientId.split('_0.')[0])
    publish('playerLocation', JSON.stringify({playerLocation}))
  } else if (topic.includes('/unsubscribes') && pl.topic.includes('chat')) {
    publish(pl.topic, JSON.stringify({
      date: Date.now(),
      player: pl.clientId.split('_0.')[0],
      message: 'left the chat'
    }))
    playerLocation.game.splice(playerLocation.game.indexOf(pl.clientId.split('_0.')[0]), 1)
    publish('playerLocation', JSON.stringify({playerLocation}))
  } else if (topic.includes('/subscribes') && pl.topic.includes('moves')) {
    publish(pl.topic, JSON.stringify({
      player: pl.clientId.split('_0.')[0],
    }))
  } else if (topic.includes('/subscribes') && pl.topic.includes('gamesList')) {
    playerLocation.lobby.push(pl.clientId.split('_0.')[0])
    publish('playerLocation', JSON.stringify({playerLocation}))
  } else if (topic.includes('/unsubscribes') && pl.topic.includes('gamesList')) {
    playerLocation.lobby.splice(playerLocation.lobby.indexOf(pl.clientId.split('_0.')[0]), 1)
    publish('playerLocation', JSON.stringify({playerLocation}))
  }
});
