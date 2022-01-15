import {createAction} from 'redux-api-middleware'
import * as types from './types'

export const postLogin = (cred) => createAction({
  endpoint: `http://localhost:5000/users/login/`,
  method: 'POST',
  body: JSON.stringify(cred),
  headers: { 'Content-Type': 'application/json' },
  types: [
    {
      type: types.REQUEST,
      meta: 'user'
    },
    {
      type: types.SUCCESS,
      payload: async (action, state, res) => {
        const json = await res.json()
        return json
      },
      meta: 'user'
    },
    {
      type: types.FAILURE,
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
      type: types.REQUEST,
      meta: 'user'
    },
    {
      type: types.SUCCESS,
      payload: async (action, state, res) => {
        const json = await res.json()
        return json
      },
      meta: 'user'
    },
    {
      type: types.FAILURE,
      meta: 'user'
    }
  ]
})


