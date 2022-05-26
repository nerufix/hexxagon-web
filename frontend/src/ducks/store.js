import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { logger } from 'redux-logger'
import { reducer } from './reducers'
import { mqttMiddleware } from './middleware';

const middleware = [apiMiddleware, mqttMiddleware, logger]
const store = createStore(reducer, applyMiddleware(...middleware));

export default store