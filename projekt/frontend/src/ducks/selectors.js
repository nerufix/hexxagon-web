//to fix
export const selectGameToPublish = (state) => {
  const {status, gamesList, board, data} = state
  return data
}

export const selectPlayerColor = (state) => {
  const index = state.game.players.findIndex(el => el===state.user.login)
  return index < 0 ? 'none' : ['red', 'blue'][index]
}