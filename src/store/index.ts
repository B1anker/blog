declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any
  }
}

import { createStore } from 'redux'

import reducers from '../reducers'

function configureStore() {
  const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore()
