var mosca = require('mosca')

var fs = require('fs')

var settings = {
  port: 1883,
  http: {port: 3333, bundle: true, static: './'}  
}

var server = new mosca.Server(settings);

const publish = (topic, message) => {
  server.publish({topic: topic, payload: message, qos: 1, retain: false})
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
  } else if (topic.includes('/unsubscribes') && pl.topic.includes('chat')) {
    publish(pl.topic, JSON.stringify({
      date: Date.now(),
      player: pl.clientId.split('_0.')[0],
      message: 'left the chat'
    }))
  } else if (topic.includes('/subscribes') && pl.topic.includes('moves')) {
    publish(pl.topic, JSON.stringify({
      player: pl.clientId.split('_0.')[0],
    }))
  }
});
