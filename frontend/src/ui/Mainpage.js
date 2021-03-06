
import Button from 'react-bootstrap/Button'
import Login from './Login'
import Dashboard from './Dashboard'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import { postLogin } from '../ducks/operations'
import Darkreader from 'react-darkreader'

function Mainpage({user, postLogin}) {


  useEffect(() => {
    const tokenCookie = document.cookie.includes('token=')
    ? document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1]
    : ''
    tokenCookie.length===36 && postLogin({token: tokenCookie})
  }, [])

  return (
    <>
      {
      document.cookie.includes('darkMode=true') && 
      <div className="invisible">
        <Darkreader defaultDarken />
      </div>
      }
      {user ? <Dashboard /> : <Login />}
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user.login
  }
}

const mapDispatchToProps = {
  postLogin
}

export default connect(mapStateToProps, mapDispatchToProps)(Mainpage)
