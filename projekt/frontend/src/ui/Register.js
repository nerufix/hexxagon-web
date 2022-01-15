import {Button} from 'react-bootstrap';
import { Field, Form, Formik } from "formik"
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react'
import * as yup from "yup"
import { connect } from 'react-redux'
import { postRegister } from '../ducks/operations'
import sha256 from 'crypto-js/sha256';

function Register({ postRegister }) {

  const history = useHistory()

  

  const handleSubmit = (values) => {
    postRegister({...values, password: sha256(values.password).toString()}).then((res) => {
      res.error ? alert('Operation failed') : alert('Registered successfully, you may now log in')
      history.push('/')
    })
  }

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    login: yup.string().required().min(5).max(30),
    password: yup.string().required().min(7).max(30),
  })

  return (
    <div className="main">
      <Formik
        initialValues={ {
          login: "",
          password: "",
          email: ""
        }}
        validationSchema={schema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values) => handleSubmit(values)}
        enableReinitialize={true}
      >
        {({ errors }) => (
          <Form className="px-2 py-3 middle bg-dark">
            <Field className={"form-control"+(errors.email ? " error" : "")} name="email" placeholder='Email' />
            <div className="text-danger">{errors.email}</div>
            <Field className={"form-control"+(errors.login ? " error" : "")} name="login" placeholder='Login' autoComplete="off" />
            <div className="text-danger">{errors.login}</div>
            <Field className={"form-control"+(errors.password ? " error" : "")} type="password" name="password" placeholder='Password' />
            <div className="text-danger">{errors.password}</div>
            <Button className="btn-secondary" type="submit">Register</Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token
  }
}

const mapDispatchToProps = {
  postRegister
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
