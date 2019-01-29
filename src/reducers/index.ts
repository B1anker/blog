import { combineReducers } from 'redux'
import system from './system'
import user from './user'

export default combineReducers({
  user,
  system
})
