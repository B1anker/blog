import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './app'
import model from '@/models'
// import { start } from './http/request'

// start()
model()

ReactDOM.render(
  <Router>
    <App />
  </Router>
  , document.querySelector('#app'))
