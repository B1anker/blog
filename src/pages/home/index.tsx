import MyFooter from '@/components/Blog/Footer'
import Header from '@/components/Blog/Header'
import Profile from '@/components/Blog/Profile'
import Scroll from '@/components/Blog/Scroll'
import React, { useEffect } from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import Articles from './Articles'
import routes from './routes'
import { MainContentStyle } from './style'

import analyze from '@/models/analyze'

const Home = (props: RouteComponentProps) => {
  useEffect(() => {
    sessionStorage.lastPathname = location.pathname

    const unlisten = props.history.listen((state) => {
      if (sessionStorage.lastPathname === state.pathname) {
        return
      }
      sessionStorage.lastPathname = state.pathname
      analyze.view(location.origin + state.pathname)
    })

    return () => {
      unlisten()
    }
  }, [])

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
          {props.location.pathname !== '/' ? null : (
            <Articles pathname={props.location.pathname} />
          )}
        </div>
        <Profile />
      </MainContentStyle>
      <MyFooter />
      <Scroll />
    </div>
  )
}

export default Home
