import {Button} from 'react-bootstrap';
import { Field, Form, Formik } from "formik"
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react'
import * as yup from "yup"
import { connect } from 'react-redux'
import { postRegister } from '../ducks/operations'
import hexagon from './img/hexagon.svg'
import title from './img/title.png'
import sha256 from 'crypto-js/sha256';
const axios = require('axios');

function Register({ user, status, ...props }) {

  const history = useHistory()

  const handleSubmit = (values) => {
    props.postRegister({...values, password: sha256(values.password).toString()}).then((res) => {
      if (!res.error) {
        alert('Registered successfully, you may now log in')
        //res.payload.response.message
        history.push('/')
      }
    })
  }

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    login: yup.string().required().min(5).max(30),
    password: yup.string().required().min(7).max(30),
  })

  return (
    <div className="main">
      <img src={title} className='title' />
      <img src={hexagon} className='bg-middle bg-hexagon' />
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
            <Field className={"form-control"+(status || errors.login ? " error" : "")} name="login" placeholder='Login' autoComplete="off" />
            <div className="text-danger">{errors.login}</div>
            <div className="text-danger">{status}</div>
            <Field className={"form-control"+(errors.password ? " error" : "")} type="password" name="password" placeholder='Password' />
            <div className="text-danger">{errors.password}</div>
            <Button className="btn-secondary" type="submit">Register</Button>
            <Button className="btn-primary" onClick={history.goBack}>Go back</Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    user: state.user,
    status: state.user.status
  }
}

const mapDispatchToProps = {
  postRegister
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
