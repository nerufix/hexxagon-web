import { connect } from "react-redux"
import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik"
import { useHistory } from "react-router-dom"
import Modal from "react-bootstrap/Modal";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { putUser, deleteUser } from "../ducks/operations";
import * as yup from 'yup';
import sha256 from 'crypto-js/sha256';
const axios = require('axios');

function UserPanel({ user, status, ...props }) {

  const [show, setShow] = useState(false);

  const history = useHistory()

  const schema = yup.object().shape({
    password: yup.string().required(),
    newPassword: yup.string().required().min(7).max(30),
  })

  const handleDeleteClick = (values) => {
    props.deleteUser(user.login, sha256(values.password).toString()).then((res) => {
      if (!res.error) {
        alert('Operation successful!')
        window.location.reload()
      }
    })
  }

  const handleChangePasswordClick = (values) => {
    props.putUser(user.login, sha256(values.password).toString(), sha256(values.newPassword).toString()).then((res) => {
      !res.error && alert('Operation successful!')
    })
  }

  const popover = (
    <Popover id="popover-basic">
    <Popover.Header as="h3">Type your password first.</Popover.Header>
    <Popover.Body>
      <Formik initialValues={{password: ''}} 
        onSubmit={(values) => handleDeleteClick(values)}>
        {() => (
          <Form>
            <Field className={"form-control"+(user.status ? " error" : "")} type="password" name="password" placeholder='Password' />
              <div className="text-danger">{user.status}</div>
            <Button variant="danger" type="submit">Delete</Button>
          </Form>
        )}
      </Formik>
    </Popover.Body>
  </Popover>
  )


  return (
    <>
    <Button variant="outline-primary" onClick={() => setShow(true)}>
      My account
    </Button>

    <Modal show={show} onHide={() => setShow(false)} enforceFocus={false}>
      <Modal.Header closeButton>
        <Modal.Title>Account settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="mt-3">Change account's password</h5>
        <Formik initialValues={{password: "", newPassword: ""}} 
          validationSchema={schema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={(values) => handleChangePasswordClick(values)}>
          {({errors}) => (
            <Form>
              <Field className={"form-control"+(status || errors.password ? " error" : "")} type="password" name="password" placeholder='Password' />
              <div className="text-danger">{errors.password}</div>
              <div className="text-danger">{status}</div>
              <Field className={"form-control"+(errors.newPassword ? " error" : "")} type="password" name="newPassword" placeholder='New password' />
              <div className="text-danger">{errors.newPassword}</div>
              <Button type="submit">Submit</Button>
            </Form>
          )}
        </Formik>
        <h5 className="mt-3">Dangerous options:</h5>
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
          <Button variant="danger">Delete account</Button>
        </OverlayTrigger>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => setShow(false)}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    status: state.user.status
  }
}

const mapDispatchToProps = {
  putUser,
  deleteUser
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPanel)
