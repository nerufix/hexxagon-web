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

export const esrcConnectionState = (client) => {
  return {
    type: types.ES_CONNECTED,
    meta: 'esrc',
    payload: client
  }
}

export const setAdUrl = (ad) => {
  return {
    type: types.ES_AD_URL,
    meta: 'esrc',
    payload: ad
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

export const updateSecondPlayer = (payload) => {
  return {
    type: types.SECOND_PLAYER,
    payload: payload
  }
}

export const setWin = (payload) => {
  return {
    type: types.OTHER,
    meta: 'game',
    payload: payload
  }
}

export const setCurrentPage = (payload) => {
  return {
    type: types.OTHER,
    meta: 'ad',
    payload: {currentPage: payload}
  }
}