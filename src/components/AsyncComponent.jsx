import React, { Component } from 'react'
import styled from 'styled-components'
import { Spin } from 'antd'

const BodySpin = styled(Spin)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export default (loadComponent) => {
  return class AsyncComponent extends Component {
    constructor (props) {
      super(props)
      this.unmount = false
      this.state = {
        Child: null
      }
    }

    componentWillUnmount () {
      this.unmount = true
    }

    async componentDidMount () {
      const { default: Child } = await loadComponent()

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
