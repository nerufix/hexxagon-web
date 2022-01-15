import * as types from "./types";

export const setBadLoginAttempt = (payload) => ({
  type: types.SUCCESS,
  meta: 'user',
  payload: {badLoginAttempt: payload}
})

export const resetUser = () => ({
  type: types.RESET,
  meta: 'user',
  payload: {}
})
