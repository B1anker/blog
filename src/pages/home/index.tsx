import React from 'react'
import Header from '@/components/blog/header'
import MyFooter from '@/components/blog/footer'
import Scroll from '@/components/blog/scroll'
import Articles from './articles'
import ExtendComponent from '@/core/component'
import Profile from '@/components/blog/profile'
import {
  Route,
  Switch,
  RouteComponentProps
} from 'react-router-dom'
import { MainContentStyle } from './style'
import routes from './routes'

export default class Home extends ExtendComponent<RouteComponentProps> {
  public render () {
    return (
      <div className='home'>
        <Header />
        <MainContentStyle className='main-content'>
          <div className="left-content">
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
            { this.props.location.pathname !=='/' ? null : <Articles pathname={this.props.location.pathname} /> }
          </div>
          <Profile />
        </MainContentStyle>
        <MyFooter />
        <Scroll />
      </div>
    )
  }
}
