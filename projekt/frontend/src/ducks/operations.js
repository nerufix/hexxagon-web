import {createAction} from 'redux-api-middleware'
import * as types from './types'

export const postLogin = (cred) => createAction({
  endpoint: `http://localhost:5000/users/login/`,
  method: 'POST',
  body: JSON.stringify(cred),
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'user'
    },
    {
      type: types.OTHER,
      payload: async (action, state, res) => {
        const json = await res.json()
        return json
      },
      meta: 'user'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'user'
    }
  ]
})

export const postRegister = (cred) => createAction({
  endpoint: `http://localhost:5000/users/register/`,
  method: 'POST',
  body: JSON.stringify(cred),
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'user'
    },
    {
      type: types.OTHER,
      payload: async (action, state, res) => {
        const json = await res.json()
        return json
      },
      meta: 'user'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'user'
    }
  ]
})

export const getGamesList = () => createAction({
  endpoint: `http://localhost:5000/games/list/`,
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'game'
    },
    {
      type: types.GAMES_LIST,
      payload: async (action, state, res) => {
        const json = await res.json()
        console.log(json)
        return json
      },
      meta: 'game'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'game'
    }
  ]
})

export const postGame = (name, player) => createAction({
  endpoint: `http://localhost:5000/games/create`,
  method: 'POST',
  body: JSON.stringify({name, player}),
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'game'
    },
    {
      type: types.SQL_SUCCESS,
      meta: 'game'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'game'
    }
  ]
})

export const joinGame = (id, player) => createAction({
  endpoint: `http://localhost:5000/games/join/${id}`,
  method: 'PUT',
  body: JSON.stringify({player: player}),
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'game'
    },
    {
      type: types.GAME,
      payload: async (action, state, res) => {
        const json = await res.json()
        return json
      },
      meta: 'game'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'game'
    }
  ]
})

export const postMessage = (id, player, message) => createAction({
  endpoint: `http://localhost:5000/games/chatMessage`,
  method: 'PUT',
  body: JSON.stringify({id: id, player: player, message: message}),
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'game'
    },
    {
      type: types.SQL_SUCCESS,
      meta: 'game'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'game'
    }
  ]
})

export const getUsers = () => createAction({
  endpoint: `http://localhost:5000/users`,
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'user'
    },
    {
      type: types.OTHER,
      payload: async (action, state, res) => {
        const json = await res.json()
        return {users: json}
      },
      meta: 'user'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'user'
    }
  ]
})

export const putAdmin = (admin, newAdmin) => createAction({
  endpoint: `http://localhost:5000/users/admin`,
  method: 'PUT',
  body: JSON.stringify({admin: admin, newAdmin: newAdmin}),
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'user'
    },
    {
      type: types.SQL_SUCCESS,
      meta: 'user'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'user'
    }
  ]
})

export const getLogs = (date='', data='') => createAction({
  endpoint: `http://localhost:5000/users/logs?date=${date.slice(0,10)}&data=${data}`,
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'user'
    },
    {
      type: types.OTHER,
      payload: async (action, state, res) => {
        const json = await res.json()
        return date || data ? {logs: json} : {latestLogs: json}
      },
      meta: 'user'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'user'
    }
  ]
})

export const postMove = (id, player, move) => createAction({
  endpoint: `http://localhost:5000/games/${id}`,
  method: 'POST',
  body: JSON.stringify({player: player, move: move}),
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'game'
    },
    {
      type: types.SQL_SUCCESS,
      meta: 'game'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'game'
    }
  ]
})