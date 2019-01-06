import React from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux'
import { setConfig } from 'react-hot-loader'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter as Router } from 'react-router-dom'
import routes from './routes'
import './styles/lib/index.less'

const App =  () => (
  <Provider store={store}>
    <Router key={Math.random()}>
      <Switch>
        {
          routes.map(({ name, path, exact = true, component }) => {
            return <Route path={path}
              exact={exact}
              component={component}
              key={name}/>
          })
        }
      </Switch>
    </Router>
  </Provider>
)

setConfig({
  pureSFC: true
})

export default hot(App)