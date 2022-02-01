import { connect } from "react-redux"
import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik"
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { 
  getUsers,
  putAdmin, 
  getLogs,
  getAds,
  postAd,
  putAd,
  deleteAd
} from "../ducks/operations";
import * as yup from 'yup';
import Pagination from "./Pagination";
const axios = require('axios');

function AdminPanel({ user, users, logs, latestLogs, ads, ...props }) {

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      props.getLogs()
      props.getUsers()
      props.getAds(user)
    }
  }, [show])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAdminSubmit = (values) => {
    props.putAdmin(user, values.login).then((err) => err ? alert('error!') : alert('Admin set!'))
  }

  const handleLogFilterSubmit = (values) => {
    props.getLogs(values.date, values.data)
  }

  const userSchema = yup.object().shape({
    login: yup.string().required()
  })

  const urlPostSchema = yup.object().shape({
    url: yup.string().required()
  })

  const urlPutSchema = yup.object().shape({
    oldUrl: yup.string().required(),
    newUrl: yup.string().required()
  })


  const getLogElement = (log) => {
    return (
      <div key={JSON.stringify(log)}><b>{new Date(log.date).toLocaleString()}: </b> {log.data}</div>
    )
  }

  const handleAdEditSubmit = (values) => {
    console.log(values)
    props.putAd(user, values.oldUrl, values.newUrl).then(res => {
      res.error ? alert('Operation failed!') : alert('Operation successful!')
    })
  }

  const handleAdDeleteClick = (ad) => {
    props.deleteAd(user, ad).then(res => {
      res.error ? alert('Operation failed!') : alert('Operation successful!')
    })
  }

  const handleAdPostSubmit = (values) => {
    props.postAd(user, values.url).then(res => {
      res.error ? alert('Operation failed!') : alert('Operation successful!')
    })
  }

  const getAdElement = (ad) => (
    <div key={ad} className="my-1 p-2 bg-info rounded d-flex flex-wrap">
      <a className="p-1 left text-white" href={ad} target="_blank">
        {ad.slice(0,35)}...  
      </a>
      <OverlayTrigger trigger="click" placement="right" overlay={
        <Popover id="popover-basic">
        <Popover.Header as="h3">Type new url:</Popover.Header>
        <Popover.Body>
          <Formik initialValues={{oldUrl: ad, newUrl: ad}} 
            onSubmit={(values) => handleAdEditSubmit(values)}
            validationSchema={urlPutSchema}>
            {({errors}) => (
              <Form>
                <Field className={"form-control"+(errors.newUrl ? " error" : "")} name="newUrl" />
                  <div className="text-danger">{errors.newUrl}</div>
                <Button variant="primary" type="submit">Submit</Button>
              </Form>
            )}
          </Formik>
        </Popover.Body>
      </Popover>
    }>
        <Button variant="primary">Edit</Button>
      </OverlayTrigger>
      <Button variant="danger" onClick={() => handleAdDeleteClick(ad)}>Delete</Button>
    </div>
  )


  return (
    <>
    <Button variant="outline-primary" onClick={handleShow}>
      Admin panel
    </Button>

    <Modal show={show} onHide={handleClose} enforceFocus={false}>
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
          validationSchema={userSchema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={(values) => handleAdminSubmit(values)}>
          {({errors}) => (
            <Form>
              <Field as="select" name="login" className="form-select">
                <option value="" default hidden>Select user...</option>
                {users.map(el => <option key={el} value={el}>{el}</option>)}
              </Field>
              {errors.login}
              <Button type="submit">Make this user an admin</Button>
            </Form>
          )}
        </Formik>
        <h5 className="mt-3">Admin ADmanager&trade;:</h5>
        <Formik initialValues={{url: ''}} 
          onSubmit={(values) => handleAdPostSubmit(values)}
          validationSchema={urlPostSchema}>
          {({errors}) => (
            <Form className="d-flex">
              <Field className={"left form-control"+(errors.url ? " error" : "")} name="url" />
                <div className="text-danger">{errors.url}</div>
              <Button variant="primary" type="submit">Add URL</Button>
            </Form>
          )}
        </Formik>
        <Pagination entity='ad' elements={ads.map(el => getAdElement(el))} />
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
    users: state.user.users || [],
    ads: state.ad.ads || []
  }
}

const mapDispatchToProps = {
  getLogs,
  getUsers,
  putAdmin,
  getAds,
  postAd,
  deleteAd,
  putAd
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel)
