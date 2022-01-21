import { connect } from "react-redux"
import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik"
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { getUsers, putAdmin, getLogs } from "../ducks/operations";
import * as yup from 'yup';
const axios = require('axios');

function AdminPanel({ user, users, logs, latestLogs, ...props }) {

  const [show, setShow] = useState(false);

  useEffect(() => {
    show && props.getLogs()
    show && props.getUsers()
  }, [show])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAdminSubmit = (values) => {
    props.putAdmin(user, values.login).then((err) => err ? alert('error!') : alert('Admin set!'))
  }

  const handleLogFilterSubmit = (values) => {
    props.getLogs(values.date, values.data)
  }

  const schema = yup.object().shape({
    login: yup.string().required()
  });

  const getLogElement = (log) => {
    return (
      <div key={JSON.stringify(log)}><b>{new Date(log.date).toLocaleString()}: </b> {log.data}</div>
    )
  }

  return (
    <>
    <Button variant="outline-primary" onClick={handleShow}>
      Admin panel
    </Button>

    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Admin panel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Latest logs:</h5>
        <div className="logbox bg-success">
          {latestLogs.map(el => getLogElement(el))}  
        </div> 
        <h5 className="mt-3">Uber log filtration software&trade;:</h5>
        <div className="logbox bg-success">
          {logs.map(el => getLogElement(el))}  
        </div> 
        <Formik initialValues={{date: "", data: ""}} 
          onSubmit={(values) => handleLogFilterSubmit(values)}>
          {() => (
            <Form>
              <Field className="form-control" type="text" onFocus={(e) => e.target.type="date"} 
                onBlur={(e) => e.target.type="text"} name="date" placeholder="Date" />    
              <Field className="form-control" name="data" placeholder="Text" />
              <Button type="submit">Filter</Button>
            </Form>
          )}
        </Formik>
        <h5 className="mt-3">Admin maker super machine&trade;:</h5>
        <Formik initialValues={{login: ""}} 
          validationSchema={schema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={(values) => handleAdminSubmit(values)}>
          {({errors}) => (
            <Form>
              <Field as="select" name="login" className="form-select">
                <option value="" default hidden>Select user...</option>
                {users.map(el => <option value={el}>{el}</option>)}
              </Field>
              {errors.login}
              <Button type="submit">Make this user an admin</Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user.login,
    logs: state.user.logs || [],
    latestLogs: state.user.latestLogs || [],
    users: state.user.users || []
  }
}

const mapDispatchToProps = {
  getLogs,
  getUsers,
  putAdmin
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel)
