import { connect } from "react-redux"
import { useEffect, useState } from "react"
import { Field, Form, Formik } from "formik"
import { Button, Popover, OverlayTrigger } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { resetUser, requestMqtt, resetMqtt } from '../ducks/actions'
import { getGamesList, postGame, joinGame } from '../ducks/operations'
import AdminPanel from "./AdminPanel"
const axios = require('axios');

function Dashboard({ user, game, token, ...props }) {

  const history = useHistory()

  useEffect(() => {
    token && (document.cookie = 'token='+token)
  }, [token, user])

  useEffect(() => {
    props.resetMqtt()
    props.requestMqtt(user.login)
    props.getGamesList()
  }, [])

  const handleLogout = () => {
    props.client.end()
    props.resetUser()
    props.resetMqtt()
    document.cookie = 'token=reset'
    history.push('/')
  }

  const handleJoinClick = (id) => {
    props.joinGame(id, user.login)
    history.push('/game/'+id)
  }

  const handleGameSubmit = (values) => {
    //props.postGame(values.name, user.login)
    axios.post('http://localhost:5000/games/create', {name: values.name, player: user.login}).then((res) => {
      props.client.publish('gamesList', JSON.stringify(res.data))
      history.push('/game/'+res.data.id)
    })
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">So you wanna game, eh?</Popover.Header>
      <Popover.Body className="row">
        <Formik initialValues={{name: ""}} onSubmit={(values) => handleGameSubmit(values)}>
          {() => (
            <Form>
              <Field className="form-control col" name="name" placeholder='Game name...' />
              <Button className="btn-primary col-auto" type="submit">Create</Button>
            </Form>
          )}
        </Formik>
      </Popover.Body>
    </Popover>
  )

  const getGameElement = (game) => {
    return (
      <div className="m-2 p-2 bg-secondary rounded d-flex justify-content-between flex-wrap">
        <div>
          <h5 className="flex-grow align-self-center">{game.name}</h5>
          <div className="break"></div>
          <div>players: {game.players.join(', ')}</div>
        </div>
        <Button onClick={() => handleJoinClick(game.id)}>
          {game.players.length===1 || game.players.includes(user.login) ? 'Join' : 'Observe'}
          </Button>
      </div>
    )
  }

  return (
    <div className="d-flex justify-content-center">
      <div className="m-3 p-2 panel bg-dark rounded">
        <div className="d-flex navbar justify-content-between">
          <div>Hello, {user.login}</div>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <Button variant="outline-secondary">Create game</Button>
          </OverlayTrigger>
          {
            user.role === 'admin' && 
            <AdminPanel />
          }
          <Button variant="outline-danger" onClick={handleLogout}>Log out</Button>
        </div>
        <div>
          {props.mqttGames.map(el => getGameElement(el))}
          {props.sqlGames.map(el => getGameElement(el))}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    state: state,
    user: state.user,
    game: state.game,
    token: state.user.token,
    client: state.mqtt.client,
    sqlGames: state.game.gamesList || [],
    mqttGames: state.mqtt.gamesList || []
  }
}

const mapDispatchToProps = {
  resetUser,
  requestMqtt,
  getGamesList,
  postGame,
  joinGame,
  resetMqtt
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
