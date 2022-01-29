import { connect } from "react-redux"
import { useEffect, useState } from "react"
import { Field, Form, Formik } from "formik"
import { Button, Popover, OverlayTrigger } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { resetUser, requestMqtt, resetEntity } from '../ducks/actions'
import { getScoreboard } from '../ducks/operations'
import { Bar, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import Loading from "./Loading"

Chart.register(...registerables)
Chart.defaults.color = "#fff";
Chart.defaults.scale.grid.color = "#737373";
console.log(Chart.defaults)
const axios = require('axios');

function Scoreboard(props) {

  const history = useHistory()

  useEffect(() => {
    props.getScoreboard()
  }, [])

  const generateBarColors = (values) => {
    const chars = '9ABCDE'
    return values.map(el => '#' + [...chars].map(char => 
      chars.charAt(Math.floor(Math.random()*6))).join(''))
  }

  
  return !props.scoreboard ? (<Loading />) : (
    <div className="m-2 p-2 plot bg-dark rounded">
      <h4 className="pt-3 text-white mid">Best players</h4>
      <div className="p-2">
        <Bar
          data={{
            labels: props.scoreboard.map(el => el.player),
            datasets: [
              {
                label: 'Player score',
                data: props.scoreboard.map(el => el.score),
                backgroundColor: generateBarColors(props.scoreboard)
              }
            ],
          }}
        />
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
    scoreboard: state.user.scoreboard
  }
}

const mapDispatchToProps = {
  getScoreboard
}

export default connect(mapStateToProps, mapDispatchToProps)(Scoreboard)
