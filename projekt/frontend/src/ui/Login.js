import {Button} from 'react-bootstrap';
import { Field, Form, Formik } from "formik"
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react'
import * as yup from "yup"
import { connect } from 'react-redux'
import { postLogin } from '../ducks/operations'
import hexagon from './img/hexagon.svg'
import title from './img/title.png'
import sha256 from 'crypto-js/sha256';

function Login({ postLogin, status }) {

  const history = useHistory()
  
  const handleSubmit = (values) => {
    postLogin({...values, password: sha256(values.password).toString()})
  }

  const schema = yup.object().shape({
    login: yup.string().required().max(30),
    password: yup.string().required().max(30),
  })

  return (
    <div className="main">
      <img src={title} className='title' />
      <img src={hexagon} className='bg-middle bg-hexagon' />
      <Formik
        initialValues={ {
          login: "",
          password: "",
          remember: false
        }}
        validationSchema={schema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values) => handleSubmit(values)}
        enableReinitialize={true}
      >
        {({ errors }) => (
          <Form className="px-2 py-3 rounded middle bg-dark">
            <Field className={"form-control"+(status || errors.login ? " error" : "")} name="login" placeholder='Login' autoComplete="off" />
            <div className="text-danger">{errors.login}</div>
            <Field className={"form-control"+(status || errors.password ? " error" : "")} type="password" name="password" placeholder='Password' />
            <div className="text-danger">{errors.password}</div>
            {status && <div className="text-danger">{status}</div>}
            <div className="form-check form-switch">
              <Field className="form-check-input" type="checkbox" name="remember" />
              <label className="form-check-label text-white">Remember me</label>
            </div>
            <Button className="btn-primary" type="submit">Log in</Button>
            <Button className="btn-secondary" onClick={() => history.push('/register')}>Register</Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    status: state.user.status
  }
}

const mapDispatchToProps = {
  postLogin
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
