import MyFooter from '@/components/Blog/Footer'
import Header from '@/components/Blog/Header'
import Profile from '@/components/Blog/Profile'
import Scroll from '@/components/Blog/Scroll'
import ExtendComponent from '@/core/component'
import React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import Articles from './Articles'
import routes from './routes'
import { MainContentStyle } from './style'

export default class Home extends ExtendComponent<RouteComponentProps> {
  public render () {
    return (
      <div className="home">
        <Header />
        <MainContentStyle className="main-content">
          <div className="left-content">
            <Switch>
              {routes.map(({ name, path, exact = true, component }) => {
                return (
                  <Route
                    path={path}
                    exact={exact}
                    component={component}
                    key={name}
                  />
                )
              })}
            </Switch>
            {this.props.location.pathname !== '/' ? null : (
              <Articles pathname={this.props.location.pathname} />
            )}
          </div>
          <Profile />
        </MainContentStyle>
        <MyFooter />
        <Scroll />
      </div>
    )
  }
}
