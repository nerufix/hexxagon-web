import { connect } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { Field, Form, Formik } from "formik"
import { Button, Popover, OverlayTrigger } from "react-bootstrap"
import { useHistory, withRouter } from "react-router-dom"
import { postMove } from '../ducks/operations'
import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex, GridGenerator } from 'react-hexgrid';
import { selectPlayerColor } from '../ducks/selectors'
import board from './img/board.png'
import hexagon from './img/hexagon.svg'
import blue from './img/blue.png'
import red from './img/red.png'
import Loading from './Loading'
const axios = require('axios');

function Game({ id, user, game, client, ...props }) {

  const history = useHistory()
  useEffect(() => {
    client.subscribe('moves/'+id)
  }, [])
  
  const blackHexagons = [
    {q: 1, r: 0, s: -1},
    {q: 0, r: -1, s: 1},
    {q: -1, r: 1, s: 0}
  ]

  const includesHex = (hex, arr) => {
    return arr.map(el => JSON.stringify(el)).includes(JSON.stringify(hex))
  }

  const hexagons = GridGenerator.hexagon(4).filter(el => !includesHex(el, blackHexagons))

  const [atSelect, setAtSelect] = useState({})
  const [movePossible, setMovePossible] = useState(false)

  
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

  const handleMoveClick = (hex) => {
    const takenTiles = game.board[Object.keys(game.board).filter(el => el!==props.playerColor)[0]]
      .filter(el => isOneTileApart(hex, el))
      console.log(takenTiles)
    if (isOneTileApart(hex, atSelect)) {
      const dataToSend = {
        turnCount: game.turnCount+1, 
        color: props.playerColor, 
        to: [hex, ...takenTiles]
      }
      client.publish('moves/'+id, JSON.stringify(dataToSend))
      props.postMove(id, user.login, dataToSend)
    } else if (isTwoTilesApart(hex, atSelect)) {
      const dataToSend = {
        turnCount: game.turnCount+1, 
        color: props.playerColor, 
        from: atSelect, 
        to: [hex, ...takenTiles]
      }
      client.publish('moves/'+id, JSON.stringify(dataToSend))
      props.postMove(id, user.login, dataToSend)
    }
    setMovePossible(false)
    setAtSelect({})
  }


  const handleSelectClick = (hex) => {
    if (game.players[game.turnCount%2] === user.login 
    && includesHex(hex, game.board[props.playerColor])) {
      setAtSelect(hex)
      setMovePossible(true)
    }
  }

  const getHexStyle = (hex) => {
    if (isOneTileApart(hex, atSelect)) {
      return {
        stroke: '#7be3f6'
      }
    } else if (isTwoTilesApart(hex, atSelect)) {
      return {
        stroke: 'yellow'
      }
    } else {
      return {
        fill: 'transparent',
        stroke: 'none'
      }
    }
  }

  const rubyStyle = {
    stroke: 'none',
    fillOpacity: 1
  }

  const gameSize = Math.min(window.innerWidth, 500)

  return !game.board ? (<Loading />) : (
    <div className="p-3">
      <div className="text-white hud d-flex">
        <div className="hexagon-red" />
        <span className="mx-1">{game.board.red.length}</span>
        <div className="mx-2" />
        <div className="hexagon-blue" />
        <span className="mx-1">{game.board.blue.length}</span>
      </div>
      <div className="game d-flex justify-content-center">
        <HexGrid width={gameSize} height={gameSize}>
          <Layout size={{ x: 6.45, y: 5.8 }} flat={true} spacing={1.1} origin={{ x: 0, y: 0 }}>
          { 
            game.board.blue.map((hex, i) => 
            <Hexagon cellStyle={rubyStyle} fill="blue" key={i} q={hex.q} r={hex.r} s={hex.s}
             onClick={() => handleSelectClick(hex)} />)
          }
          { 
            game.board.red.map((hex, i) => 
            <Hexagon cellStyle={rubyStyle} fill="red" key={i} q={hex.q} r={hex.r} s={hex.s}
             onClick={() => handleSelectClick(hex)} />)
          }
          { 
            hexagons.filter(el => !includesHex(el, game.board.red) && !includesHex(el, game.board.blue)).map((hex, i) => 
            <Hexagon cellStyle={getHexStyle(hex)} key={i} q={hex.q} r={hex.r} s={hex.s} onClick={() => movePossible && handleMoveClick(hex)} />)
          }
          </Layout>
          <Pattern id="red" link={red} size={{x: 6.5, y: 5}} />
          <Pattern id="blue" link={blue} size={{x: 6.5, y: 5}} />
        </HexGrid>
      </div>
      <div className="d-flex flex-row justify-content-center text-white h3">It's {game.players[game.turnCount%2]}'s turn.</div>
    </div>
  )
}

const mapStateToProps = (state, props) => {
  return {
    client: state.mqtt.client,
    game: state.game,
    user: state.user,
    id: props.match.params.id,
    playerColor: state.game.players ? selectPlayerColor(state) : ''
  }
}

const mapDispatchToProps = {
  postMove
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game))


/*
<div className="d-inline">
          <img src={hexagon} width="50px" class="hexagon img-fluid"/>
          <img src={hexagon} width="50px" class=" img-fluid"/>
          <img src={hexagon} width="50px" class="hexagon img-fluid"/>
          <img src={hexagon} width="50px" class=" img-fluid"/>
          <img src={hexagon} width="50px" class="hexagon img-fluid"/>
          <img src={hexagon} width="50px" class=" img-fluid"/>
        </div>
        <div className="w-100" />
        <div className="d-inline">

        </div>
        */