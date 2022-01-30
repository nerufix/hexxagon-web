import { updateChat, 
  updateGamesList, 
  updateMove, 
  mqttConnectionInit,
  mqttConnectionState,
  esrcConnectionState, 
  updateSecondPlayer,
  setAdUrl,
  setWin,
  setPlayerLocation,
  setInvitation
} from './actions';
import { checkWin } from './selectors'
import { connect } from "mqtt/dist/mqtt" 
import { MQTT_REQUEST } from './types';


export const mqttMiddleware = store => next => action => {
  if (action.type == MQTT_REQUEST && !store.getState().mqtt.client) {
    store.dispatch(mqttConnectionInit());
    
    const client = connect(process.env.REACT_APP_API_ADDR.replace('http', 'ws')+`:3333`, {clientId: action.payload+'_'+Math.random().toString()});
    client.on('connect', () => {
      store.dispatch(mqttConnectionState(client));
    });

    client.on('message', ((topic, payload) => {
      console.log('received message', payload.toString(), 'on topic', topic)
      const data = JSON.parse(payload.toString())
      if (topic==='gamesList') {
        (!store.gamesList || !store.gamesList.includes(data)) && store.dispatch(updateGamesList(data))
      } else if (topic && topic.includes('chat/')) {
        store.dispatch(updateChat(data))
      } else if (topic && topic.includes('moves/')) {
        data.to && store.dispatch(updateMove(data))
        const currentPlayers = store.getState().game.players
        currentPlayers.length==1 && !currentPlayers.includes(data.player) && store.dispatch(updateSecondPlayer(data.player))
        const checkWinOutput = checkWin(store.getState().game)
        checkWinOutput!==false && store.dispatch(setWin(checkWinOutput))
      } else if (topic && topic.includes('playerLocation')) {
        store.dispatch(setPlayerLocation(data))
      } else if (topic && topic.includes('invite/'+store.getState().user.login)) {
        store.dispatch(setInvitation(data))
      }
    }));

    const es = new EventSource(process.env.REACT_APP_API_ADDR+":7654")
    store.dispatch(esrcConnectionState(es))
    es.onmessage = (event) => store.dispatch(setAdUrl(event.data))
  }

  return next(action);
};