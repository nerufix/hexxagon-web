import { connect } from "react-redux"
import { useEffect, useState } from "react"
import { Field, Form, Formik } from "formik"
import { Button, Popover, OverlayTrigger, Toast } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { resetUser, requestMqtt, resetEntity } from '../ducks/actions'
import { getGamesList, postGame, joinGame, deleteGame } from '../ducks/operations'
import AdminPanel from "./AdminPanel"
import UserPanel from "./UserPanel"
import Scoreboard from "./Scoreboard"
import Loading from "./Loading"
import { Switch, useDarkreader } from 'react-darkreader';
import Pagination from "./Pagination"
const axios = require('axios');

function Dashboard({ user, game, token, games, client, ...props }) {

  const history = useHistory()

  const [isDark, { toggle }] = useDarkreader(document.cookie.includes('darkMode=true'));
  const [notificationShow, setNotificationShow] = useState(false)

  useEffect(() => {
    token && (document.cookie = 'token='+token)
  }, [token, user])

  useEffect(() => {
    props.resetEntity('game')
    if (game.id) {
      client.unsubscribe('moves/'+game.id)
      client.unsubscribe('chat/'+game.id)
    }
    props.requestMqtt(user.login)
    props.getGamesList()
  }, [])
  
  useEffect(() => {
    document.cookie = 'darkMode='+(isDark ? 'true' : 'false')
  }, [isDark])

  useEffect(() => {
    if (client) {
      client.subscribe(`gamesList`, { qos: 2 });
      client.subscribe('playerLocation', { qos: 2 })
      client.subscribe('invite/'+user.login, { qos: 2 })
    }
  }, [client])

  useEffect(() => {
    props.invitation && setNotificationShow(true)
  }, [props.invitation])

  const handleLogout = () => {
    props.resetEntity('user')
    props.resetEntity('mqtt')
    client.unsubscribe(`gamesList`);
    document.cookie = 'token=reset'
    history.push('/')
  }

  const handleJoinClick = (id) => {
    props.joinGame(id, user.login)
    history.push('/game/'+id)
  }

  const handleDeleteClick = (id) => {
    props.deleteGame(id)
  }

  const handleGameSubmit = (values) => {
    //props.postGame(values.name, user.login)
    axios.post(process.env.REACT_APP_API_ADDR+':5000/games/create', {name: values.name, player: user.login}).then((res) => {
      client.publish('gamesList', JSON.stringify(res.data))
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
      <div className="m-2 p-2 bg-secondary rounded d-flex flex-wrap">
        <div className="left">
          <h5>{game.name}</h5>
          <div className="break"></div>
          <div>players: {game.players.join(', ')}</div>
        </div>
        <Button onClick={() => handleJoinClick(game.id)}>
          {game.players.length===1 || game.players.includes(user.login) ? 'Join' : 'Observe'}
        </Button>
        {
          user.role==='admin' && (
            <Button variant="danger" onClick={() => handleDeleteClick(game.id)}>
              Delete
            </Button>
          )
        }
        
      </div>
    )
  }

  const getNotification = () => (
    <Toast className="notification" onClose={() => setNotificationShow(false)} show={notificationShow}>
      <Toast.Header>
        <strong className="me-auto">Invitation</strong>
        <small>just now</small>
      </Toast.Header>
      <Toast.Body>
        Howdy partner, it's your boy {props.invitation.from}, come play with me!
        <Button variant="outline-primary" onClick={() => history.push('game/'+props.invitation.id)}>
          Accept
        </Button>
        <Button variant="outline-danger" onClick={() => setNotificationShow(false)}>Decline</Button>
      </Toast.Body>
    </Toast>
  )

  return (
    <div className="d-flex flex-wrap justify-content-center">
      {props.invitation && getNotification()}
      <div>
        <div className="m-2 p-2 panel bg-dark rounded">
          <div className="d-flex navbar justify-content-end">
            <div>Hello, {user.login}</div>
            <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
              <Button variant="outline-secondary">Create game</Button>
            </OverlayTrigger>
            {
              user.role === 'admin' && 
              <AdminPanel />
            }
            <UserPanel />
            <Button variant="outline-danger" onClick={handleLogout}>Log out</Button>
          </div>
          <div>
          <Switch checked={isDark} onChange={toggle} />
          <Pagination entity="game" elements={games.map(el => getGameElement(el))} />
          </div>
        </div>
        <div className="m-2 p-2 text-white bg-dark rounded">
          <div>
            Players currently in lobby: {props.playerLocation.lobby ? props.playerLocation.lobby.join(',') : ''}
          </div>
          <div>
            Players currently in game: {props.playerLocation.game ? props.playerLocation.game.join(',') : ''}
          </div>
        </div>
      </div>
      <div>
        <Scoreboard />
        <div className="ad m-2 p-2 bg-dark rounded d-flex justify-content-center align-center">
          <span className="px-1 text-white bg-primary rounded x-sign">&times;</span>
          <img src={props.adUrl} alt="A message from our sponsor will soon appear." />
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
    games: state.game.gamesList,
    adUrl: state.esrc.adUrl,
    playerLocation: state.user.playerLocation,
    invitation: state.game.invitation
  }
}

const mapDispatchToProps = {
  requestMqtt,
  getGamesList,
  postGame,
  joinGame,
  resetEntity,
  deleteGame
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
