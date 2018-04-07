import React, { Component } from 'react'

export default (loadComponent, placeholder = '拼命加载中') => {
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
      return placeholder
    }
  }
}
