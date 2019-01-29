import installModels from '@/models'
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './app'

installModels()

render(<AppContainer>
  <App />
</AppContainer>,
  document.querySelector('#app')
)
