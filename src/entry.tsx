import installModels from '@/models'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './app'

installModels()

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.querySelector('#app')
)
