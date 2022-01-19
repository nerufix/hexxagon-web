var mosca = require('mosca')

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
  console.log('Published v2', topic, payload.topic); //payload.clientId, payload.tpic
  const pl = payload[0] === '{' ? JSON.parse(payload) : {}
  console.log(pl)
  if (!pl.topic || !pl.clientId || !pl.topic.includes('chat')) {
    console.log(topic)
  } else if (topic.includes('/subscribes')) {
    publish(pl.topic, JSON.stringify({
      date: Date.now(),
      player: pl.clientId.split('_0.')[0],
      message: 'connected to the chat'
    }))
  } else if (topic.includes('/unsubscribes')) {
    publish(pl.topic, JSON.stringify({
      date: Date.now(),
      player: pl.clientId.split('_0.')[0],
      message: 'left the chat'
    }))
  }
});
