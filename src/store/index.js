import { combineReducers, createStore } from 'redux'

import system from './system'

export default createStore(combineReducers({
  system
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
