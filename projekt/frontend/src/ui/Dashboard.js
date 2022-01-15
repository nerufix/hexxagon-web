import { connect } from "react-redux"
import { useEffect } from "react"
import { Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { resetUser } from '../ducks/actions'


function Dashboard({ user, token, resetUser }) {

  const history = useHistory()

  useEffect(() => {
    user.login || history.push('/')
    token && (document.cookie = 'token='+token)
  }, [token, user])


  const handleLogout = () => {
    resetUser()
    document.cookie = 'token=reset'
    history.push('/')
  }

  return (
    <div className="d-flex justify-content-center">
      <div className="m-3 p-2 panel bg-dark rounded">
        <div className="d-flex navbar">
          <div className="flex-grow-1">Hello, {user.login}</div>
          {
            user.role === 'admin' && 
            <Button variant="outline-primary" className="mx-3" onClick={handleLogout}>
              Admin panel
            </Button>
          }
          <Button variant="outline-danger" onClick={handleLogout}>Log out</Button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    token: state.user.token
  }
}

const mapDispatchToProps = {
  resetUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
