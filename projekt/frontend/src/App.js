import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import ScrollToTop from './ui/ScrollToTop'
import React, { useEffect } from 'react'
import Mainpage from "./ui/Mainpage"
import Register from './ui/Register';
import Room from './ui/Room';

function App() {

  return (
    <Router>
      <ScrollToTop />
      <Switch>
        <Route path="/game/:id">
          <Room />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/">
          <Mainpage />
        </Route>
      </Switch>
      {//status && <div className='status'><h1>{status}</h1></div>
      }
    </Router>
  )
}

export default App
