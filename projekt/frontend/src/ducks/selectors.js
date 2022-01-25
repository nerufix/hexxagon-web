//to fix
import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex, GridGenerator } from 'react-hexgrid';

export const selectGameToPublish = (state) => {
  const {status, gamesList, board, data} = state
  return data
}

export const selectPlayerColor = (state) => {
  const index = state.game.players.findIndex(el => el===state.user.login)
  return index < 0 ? 'none' : ['red', 'blue'][index]
}







const blackHexagons = [
  {q: 1, r: 0, s: -1},
  {q: 0, r: -1, s: 1},
  {q: -1, r: 1, s: 0}
]

const includesHex = (hex, arr) => {
  return arr.map(el => JSON.stringify(el)).includes(JSON.stringify(hex))
}

const hexagons = GridGenerator.hexagon(4).filter(el => !includesHex(el, blackHexagons))

const isOneTileApart = (hex1, hex2) => {
  const hexValues = Object.values(hex1)
  const selectValues = Object.values(hex2)
  return hexValues.every((el, i) => [-1,0,1].includes(el-selectValues[i]))
}

const isTwoTilesApart = (hex1, hex2) => {
  const hexValues = Object.values(hex1)
  const selectValues = Object.values(hex2)
  return hexValues.every((el, i) => [-2,-1,0,1,2].includes(el-selectValues[i]))
}

export const checkWin = (game) => {
  const remainingTiles = hexagons.filter(hex => !includesHex(hex, [...game.board.blue, ...game.board.red]))
  const blockedIndex = Object.keys(game.board).findIndex(color => remainingTiles.every(tile => 
    game.board[color].filter(hex => isOneTileApart(hex, tile) || isTwoTilesApart(hex, tile)).length==0
  ))
  console.log(blockedIndex)
  return blockedIndex>-1 ? {
    end: true,
    remainingTiles: remainingTiles, 
    redScore: blockedIndex===1 ? game.board.red.length+remainingTiles.length : game.board.red.length,
    blueScore: blockedIndex===0 ? game.board.blue.length+remainingTiles.length : game.board.blue.length,
  } : false
}