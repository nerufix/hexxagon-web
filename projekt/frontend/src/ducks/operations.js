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
  endpoint: `http://localhost:5000/games/`,
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'game'
    },
    {
      type: types.OTHER,
      payload: async (action, state, res) => {
        const json = await res.json()
        return {gamesList: json}
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
  endpoint: `http://localhost:5000/games/move/${id}`,
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

export const getScoreboard = () => createAction({
  endpoint: `http://localhost:5000/users/scoreboard/`,
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
        return {scoreboard: json}
      },
      meta: 'user'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'user'
    }
  ]
})

export const deleteGame = (id) => createAction({
  endpoint: `http://localhost:5000/games/${id}`,
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'game'
    },
    {
      type: types.OTHER,
      payload: async (action, state, res) => {
        const json = await res.json()
        return {gamesList: json}
      },
      meta: 'game'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'game'
    }
  ]
})

export const putScore = (player, score) => createAction({
  endpoint: `http://localhost:5000/users/score`,
  body: JSON.stringify({player: player, score: score}),
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.SQL_REQUEST,
      meta: 'user'
    },
    {
      type: types.OTHER,
      meta: 'user'
    },
    {
      type: types.SQL_FAILURE,
      meta: 'user'
    }
  ]
})

export const putMove = (id, hex, oldColor, newColor) => createAction({
  endpoint: `http://localhost:5000/games/move/${id}`,
  body: JSON.stringify({hex, oldColor, newColor}),
  method: 'PUT',
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

export const deleteMove = (id, hex, color) => createAction({
  endpoint: `http://localhost:5000/games/move/${id}`,
  body: JSON.stringify({hex, color}),
  method: 'DELETE',
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

export const putUser = (login, password, newPassword) => createAction({
  endpoint: `http://localhost:5000/users`,
  body: JSON.stringify({login, password, newPassword}),
  method: 'PUT',
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

export const deleteUser = (login, password) => createAction({
  endpoint: `http://localhost:5000/users`,
  body: JSON.stringify({login, password}),
  method: 'DELETE',
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