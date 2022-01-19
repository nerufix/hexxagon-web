import { combineReducers, createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { logger } from 'redux-logger'
import { reducer } from './reducers'
import { mqttMiddleware } from './middleware';


const store = createStore(reducer, applyMiddleware(apiMiddleware, logger, mqttMiddleware));

export default store