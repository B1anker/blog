import installModels from '@/models'
import React from 'react'
import { render } from 'react-dom'
import App from './app'
import { AppContainer } from 'react-hot-loader'

installModels()

render(<AppContainer>
  <App />
</AppContainer>,
  document.querySelector('#app')
)
