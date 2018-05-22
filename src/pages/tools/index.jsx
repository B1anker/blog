import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import routes from './routes'

export default class Tools extends Component {
  render () {
    return (
      <Switch>
        {
          routes.map(({ name, path, exact = false, component, redirect }) => <Route path={path} exact={exact} component={component} key={name}/>)
        }
      </Switch>
    )
  }
}