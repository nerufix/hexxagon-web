import * as types from "./types"

const loading = 'loading'
const error = 'error'

const defaultState = {
  user: {},
  game: {}
} 

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.REQUEST:
      return {...state, [action.meta]: {
        ...state[action.meta],
        status: loading
      }}
    case types.SUCCESS:
      return {...state, [action.meta]: {
        ...state[action.meta],
        ...action.payload,
        status: ''
      }}
    case types.FAILURE:
      return {...state, [action.meta]: {
        ...state[action.meta],
        status: error
      }}
    case types.RESET:
      return {...state, [action.meta]: {}}
    default:
      return state;
  }
}

