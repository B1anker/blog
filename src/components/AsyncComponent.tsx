import { Icon, Spin } from 'antd'
import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components'

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin={true} />

const BodySpin = styled((props) => <Spin {...props} indicator={antIcon} />)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const AsyncComponentStyle = styled.div`
  height: 100%;

  .fade-enter {
    transform: translateX(-5%);
    opacity: 0.01;
  }

  .fade-enter-active {
    opacity: 1;
    transform: translateX(0%);
    transition: all 200ms ease-in;
  }

  .fade-exit {
    transform: translateX(0%);
    opacity: 1;
  }

  .fade-exit-active {
    transform: translateX(5%);
    opacity: 0.01;
    transition: all 200ms ease-in;
  }
`

interface AsyncComponentProps {
  role: 'ADMIN' | 'VISITOR' | 'NORMAL'
}

interface AsyncComponentState {
  Child: (new (...args: any[]) => React.Component) | null
}

const GenAsyncComponent = (loadComponent: () => Promise<any>) => {
  return class AsyncComponent extends Component<
    AsyncComponentProps,
    AsyncComponentState
  > {
    private unmount: boolean = false
    constructor (props) {
      super(props)
      this.state = {
        Child: null
      }
    }

    public componentWillUnmount () {
      this.setState({
        Child: null
      })
      this.unmount = true
    }

    public async componentDidMount () {
      const { default: Child } = await loadComponent()
      if (this.unmount) {
        return
      }
      this.setState({
        Child
      })
    }

    public render () {
      const { Child } = this.state
      let renderComponent
      if (Child) {
        renderComponent = <Child {...this.props} />
      } else {
        renderComponent = (
          <div
            style={{
              width: '100%',
              minHeight: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <BodySpin size="large" />
          </div>
        )
      }
      return (
        <AsyncComponentStyle>
          <CSSTransition
            timeout={200}
            in={!!this.state.Child}
            classNames="fade"
          >
            {renderComponent}
          </CSSTransition>
        </AsyncComponentStyle>
      )
    }
  }
}

export default GenAsyncComponent
