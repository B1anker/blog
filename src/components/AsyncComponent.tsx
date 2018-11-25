import React, { Component } from 'react'
import { SpinProps } from 'antd/lib/spin'
import styled from 'styled-components'
import { Spin } from 'antd'

const BodySpin = styled((props: SpinProps) => <Spin {...props}/>)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

interface AsyncComponentState {
  Child: (new(...args: any[]) => React.Component) | null
}

const GenAsyncComponent = (loadComponent: () => Promise<any>) => {
  return class AsyncComponent extends Component<{}, AsyncComponentState> {
    private unmount: boolean = false
    constructor (props) {
      super(props)
      this.state = {
        Child: null
      }
    }

    componentWillUnmount () {
      this.unmount = true
    }

    async componentDidMount () {
      const { default: Child} = await loadComponent()

      if (this.unmount) {
        return
      }

      this.setState({
        Child
      })
    }

    render () {
      const { Child } = this.state
      if (Child) {
        return (
          <Child {...this.props} />
        )
      }
      return <BodySpin size="large"/>
    }
  }
}

export default GenAsyncComponent
