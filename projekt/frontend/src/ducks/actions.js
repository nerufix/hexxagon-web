import * as types from "./types";

export const setBadLoginAttempt = (payload) => ({
  type: types.SQL_SUCCESS,
  meta: 'user',
  payload: {badLoginAttempt: payload}
})

export const resetUser = () => ({
  type: types.RESET,
  meta: 'user'
})

export const resetMqtt = () => ({
  type: types.RESET,
  meta: 'mqtt'
})

export const requestMqtt = (login) => ({
  type: types.MQTT_REQUEST,
  payload: login
})

export const mqttConnectionInit = () => {
  return {
    type: types.MQTT_INIT,
    meta: 'mqtt'
  }
}

export const mqttConnectionState = (client) => {
  return {
    type: types.MQTT_CONNECTED,
    meta: 'mqtt',
    payload: client
  }
}

export const mqttSetData = (topic, payload) => {
  return {
    type: types.MQTT_DATA,
    meta: 'mqtt',
    payload: { [topic]: payload }
  }
}