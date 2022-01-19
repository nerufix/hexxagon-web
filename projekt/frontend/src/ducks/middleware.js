import { mqttConnectionInit, mqttConnectionState, mqttSetData } from './actions';
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
      const state = store.getState().mqtt
      const data = JSON.parse(payload.toString())
      if (topic==='gamesList') {
        (!store.gamesList || !store.gamesList.includes(data)) && store.dispatch(mqttSetData('gamesList', [
          data,
          ...state.gamesList
        ]))
      } else if (topic && topic.includes('chat/')) {
        store.dispatch(mqttSetData('chat', [...state.chat, data]))
      } 
    }));

    //client.publish('/topic', 'xd')
  }

  next(action);
};