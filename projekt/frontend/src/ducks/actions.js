import * as types from "./types";

export const setBadLoginAttempt = (payload) => ({
  type: types.OTHER,
  meta: 'user',
  payload: {badLoginAttempt: payload}
})

export const resetEntity = (entity) => ({
  type: types.RESET,
  meta: entity
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

export const updateGamesList = (payload) => {
  return {
    type: types.GAMES_LIST,
    payload: payload
  }
}

export const updateChat = (payload) => {
  return {
    type: types.CHAT,
    payload: payload
  }
}

export const updateMove = (payload) => {
  return {
    type: types.MOVE,
    payload: payload
  }
}