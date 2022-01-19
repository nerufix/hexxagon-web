import * as types from "./types"

const loading = 'loading'
const error = 'error'

const defaultState = {
  user: {},
  game: {},
  mqtt: {
    chat: [],
    gamesList: []
  }
} 

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.SQL_REQUEST:
      return {...state, [action.meta]: {
        ...state[action.meta],
        status: loading
      }}
    case types.SQL_SUCCESS:
      return {...state, [action.meta]: {
        ...state[action.meta],
        ...action.payload,
        status: ''
      }}
    case types.SQL_FAILURE:
      return {...state, [action.meta]: {
        ...state[action.meta],
        status: error
      }}
    case types.MQTT_INIT:
      return {...state, [action.meta]: {
        ...state[action.meta],
        client: null
      }}
    case types.MQTT_CONNECTED:
      return {...state, [action.meta]: {
        ...state[action.meta],
        client: action.payload
      }}
    case types.MQTT_DATA:
      return {...state, [action.meta]: {
        ...state[action.meta],
        ...action.payload
      }}
    case types.RESET:
      return {...state, [action.meta]: defaultState[action.meta]}
    default:
      return state;
  }
}

