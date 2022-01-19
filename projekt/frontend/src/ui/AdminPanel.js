import { connect } from "react-redux"
import { useEffect, useState } from "react"
import { Field, Form, Formik } from "formik"
import { Button, Popover, OverlayTrigger } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { resetUser, requestMqtt } from '../ducks/actions'
import { getGamesList, postGame, joinGame } from '../ducks/operations'
const axios = require('axios');

function AdminPanel({ user, game, token, resetUser, ...props }) {

  return (
    <div className="d-flex justify-content-center">
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
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel)
