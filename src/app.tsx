import './styles/lib/index.less'

import Loading from '@/components/Loading'
import React, { Suspense } from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import analyze from '@/models/analyze'
import routes from './routes'
import store from './store'

analyze.view(location.href)

const App = () => (
  <Provider store={store}>
    <Router>
      <Suspense fallback={<Loading />}>
        <Switch>
          {
            routes.map(({ name, path, exact = true, component }) => {
              return <Route path={path}
                exact={exact}
                component={component}
                key={name}
              />
            })
          }
        </Switch>
      </Suspense>
    </Router>
  </Provider>
)

export default hot(App)
