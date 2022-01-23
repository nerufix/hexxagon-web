import { updateChat, updateGamesList, updateMove, mqttConnectionInit, mqttConnectionState } from './actions';
import { connect } from "mqtt/dist/mqtt" 
import { MQTT_REQUEST } from './types';

export const mqttMiddleware = store => next => action => {
  if (action.type == MQTT_REQUEST && !store.getState().mqtt.client) {
    store.dispatch(mqttConnectionInit());
    const client = connect(`ws://localhost:3333`, {clientId: action.payload+'_'+Math.random().toString()});
    client.on('connect', () => {
      store.dispatch(mqttConnectionState(client));
      client.subscribe(`gamesList`);
    });

    client.on('message', ((topic, payload) => {
      console.log('received message', payload.toString(), 'on topic', topic)
      const data = JSON.parse(payload.toString())
      if (topic==='gamesList') {
        (!store.gamesList || !store.gamesList.includes(data)) && store.dispatch(updateGamesList(data))
      } else if (topic && topic.includes('chat/')) {
        store.dispatch(updateChat(data))
      } else if (topic && topic.includes('moves/')) {
        store.dispatch(updateMove(data))
      } 
    }));

    //client.publish('/topic', 'xd')
  }

  next(action);
};