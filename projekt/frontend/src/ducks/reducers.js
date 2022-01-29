import * as types from "./types"

const loading = 'loading'
const error = 'error'

const defaultState = {
  user: {
    scoreboard: []
  },
  game: {
    gamesList: [],
    chat: []
  },
  ad: {
    currentPage: 1,
  },
  mqtt: {},
  esrc: {}
} 

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.SQL_REQUEST:
      return {...state, [action.meta]: {
        ...state[action.meta],
        //status: loading
      }}
    case types.SQL_FAILURE:
      return {...state, [action.meta]: {
        ...state[action.meta],
        status: action.payload.response?.message
      }}
    case types.SQL_SUCCESS:
      return {...state, [action.meta]: {
        ...state[action.meta],
        status: ''
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
    case types.GAMES_LIST:
      const games = Array.isArray(action.payload) ? action.payload : [action.payload]
      return {...state, game: {
        ...state.game,
        gamesList: [...games, ...state.game.gamesList]
      }}
    case types.CHAT:
      const chat = Array.isArray(action.payload) ? action.payload : [action.payload]
      return {...state, game: {
        ...state.game,
        chat: [...state.game.chat, ...chat]
      }}
    case types.GAME:
      return {...state, game: {
        ...state.game,
        ...action.payload
      }}   
    case types.MOVE:
      const otherColor = action.payload.color === 'blue' ? 'red' : 'blue'
      return {...state, game: {
        ...state.game,
        turnCount: action.payload.turnCount,
        board: {
          ...state.game.board, 
          [action.payload.color]: [
            ...state.game.board[action.payload.color].filter(el => JSON.stringify(el) !== JSON.stringify(action.payload.from)), 
            ...action.payload.to
          ],
          [otherColor]: [
            ...state.game.board[otherColor].filter(el => !action.payload.to.map(to => JSON.stringify(to)).includes(JSON.stringify(el)))
          ]
        }
      }}
    case types.SECOND_PLAYER:
      return {...state, game: {
        ...state.game,
        players: [...state.game.players, action.payload]
      }} 
    case types.SCOREBOARD:
      return {...state, user: {
        ...state.user,
        scoreboard: [...state.user.scoreboard, action.payload]
      }} 
    case types.ES_CONNECTED:
      return {...state, esrc: {
        ...state.esrc,
        es: action.payload
      }} 
    case types.ES_AD_URL:
      return {...state, esrc: {
        ...state.esrc,
        adUrl: action.payload
      }} 
    case types.OTHER:
      //const payload = Array.isArray(action.payload) ? action.payload : [action.payload]
      return {...state, [action.meta]: {
        ...state[action.meta],
        ...action.payload,
        status: ''
      }} 
    case types.RESET:
      return {...state, [action.meta]: defaultState[action.meta]}
    default:
      return state;
  }
}

