import { connect } from "react-redux"
import { useEffect, useRef  } from "react"
import { Field, Form, Formik } from "formik"
import { Button, Popover, OverlayTrigger } from "react-bootstrap"
import { useHistory, withRouter } from "react-router-dom"
import { resetUser, requestMqtt, resetEntity } from '../ducks/actions'
import { postMessage, joinGame } from '../ducks/operations'
import ScrollableFeed from 'react-scrollable-feed'
import Game from "./Game"
import Darkreader from "react-darkreader"
const axios = require('axios');

function Room({ id, user, game, client, es, chat, ...props }) {

  const history = useHistory()

  useEffect(() => {
    props.joinGame(id, user.login)
    client.subscribe('chat/'+id, { qos: 1 })
    client.unsubscribe('gamesList', { qos: 1 })
  }, [])
  
  const handleChatSend = (values) => {
    props.postMessage(id, user.login, values.message)
    client.publish('chat/'+id, JSON.stringify({
      date: new Date(),
      player: user.login, 
      message: values.message
    }), {qos: 1})
  }

  const getChatMessage = (message) => {
    return (
      <div key={JSON.stringify(message)} className="p-1 text-white">
        <span className="bg-info text-white mx-1 p-1 rounded">
          {new Date(message.date).toLocaleTimeString().slice(0,5)}
        </span>
        <span>{message.player+': '}</span>
        <span>{message.message}</span>
      </div>
    )
  }

  return (
    <div className="d-flex justify-content-center align-items-center flex-wrap">
      {
      document.cookie.includes('darkMode=true') && 
      <div className="invisible">
        <Darkreader defaultDarken />
      </div>
      }
      <Game />
      <div>
        <div className="chatbox rounded bg-dark">
          <ScrollableFeed>
            {chat.map(el => getChatMessage(el))}
          </ScrollableFeed>
        </div>
        <Formik initialValues={{message: ""}} onSubmit={(values) => handleChatSend(values)}>
          {() => (
            <Form className="d-flex">
              <Field className="form-control col" name="message" placeholder='Type message...' autoComplete="off" />
              <Button className="btn-primary col-auto" type="submit">Send</Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

const mapStateToProps = (state, props) => {
  return {
    client: state.mqtt.client,
    game: state.game,
    user: state.user,
    id: props.match.params.id,
    es: state.esrc.es,
    chat: state.game.chat.slice(-30)
  }
}

const mapDispatchToProps = {
  postMessage,
  joinGame
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Room))
