import { connect } from "react-redux"
import { useEffect, useRef  } from "react"
import { Field, Form, Formik } from "formik"
import { Button, Popover, OverlayTrigger } from "react-bootstrap"
import { useHistory, withRouter } from "react-router-dom"
import { resetUser, requestMqtt, mqttSetData } from '../ducks/actions'
import { postMessage, joinGame } from '../ducks/operations'
const axios = require('axios');

function Room({ id, user, game, client, chat, ...props }) {

  const history = useHistory()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    props.joinGame(id, user.login)
    client.subscribe('chat/'+id)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chat]);

  

  const handleChatSend = (values) => {
    props.postMessage(id, user.login, values.message)
    client.publish('chat/'+id, JSON.stringify({
      date: new Date(),
      player: user.login, 
      message: values.message
    }))
  }

  const getChatMessage = (message) => {
    return (
      <div className="p-1 text-white">
        <span className="bg-dark text-white mx-1 p-1 rounded">
          {new Date(message.date).toLocaleTimeString().slice(0,5)}
        </span>
        <span>{message.player+': '}</span>
        <span>{message.message}</span>
      </div>
    )
  }

  return (
    <div className="d-flex justify-content-center flex-wrap">
      <div>
        <div className="chatbox rounded bg-info">
          {chat.map(el => getChatMessage(el))}
          <div ref={messagesEndRef} />
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
    chat: state.game.chat ? [...state.game.chat, ...state.mqtt.chat].slice(-30) : []
  }
}

const mapDispatchToProps = {
  postMessage,
  joinGame,
  mqttSetData
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Room))
