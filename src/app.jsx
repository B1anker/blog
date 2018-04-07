import React from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'
import './styles/lib/common.less'
import './styles/lib/font.less'
import './styles/lib/reset.less'

import routes from './routes'

export default () => (
  <Switch>
    {
      routes.map(({ name, path, exact = true, component }) => {
        return <Route path={path} exact={exact} component={component} key={name}/>
      })
    }
  </Switch>
)
