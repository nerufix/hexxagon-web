import { combineReducers, createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { logger } from 'redux-logger'
import { reducer } from './reducers'

const store = createStore(reducer, applyMiddleware(apiMiddleware, logger));

export default store