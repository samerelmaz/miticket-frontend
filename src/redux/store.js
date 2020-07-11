import { createStore, combineReducers } from 'redux'
import { userReducer } from './reducers'

export default createStore(combineReducers({userReducer}));