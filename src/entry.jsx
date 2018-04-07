import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './app'
import { start } from './http/request'

start()

ReactDOM.render(
  <Router>
    <App />
  </Router>
  , document.querySelector('#app'))
