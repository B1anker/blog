import React, { Component } from 'react'
import { ScrollStyle } from './style'
import throttle from 'lodash/throttle'

export default class Scroll extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
    this.unmount = false
    this.throttled = throttle(this.scroll, 300)
  }

  componentDidMount () {
    document.querySelector('#app').addEventListener('scroll', this.throttled.bind(this))
  }

  componentWillUnmount () {
    this.unmount = true
    this.throttled.bind(this).cancel()
    document.querySelector('#app').removeEventListener('scroll', this.throttled.bind(this))
  }

  shouldComponentUpdate (prevProps, prevState) {
    if (this.state.active === prevState.active) {
      return false
    }
    return true
  }

  render () {
    return (
      <ScrollStyle className={`scroll ${this.state.active ? 'active' : ''}`}
        onClick={() => this.scrollToTop()} />
    )
  }

  scroll () {
    if (this.unmount) {
      return
    }
    const top = document.querySelector('#app').scrollTop
    if (top > 100) {
      this.setState({
        active: true
      })
    } else {
      this.setState({
        active: false
      })
    }
  }

  scrollToTop () {
    const doc = document.documentElement
    let top = doc.scrollTop
    const step = Math.ceil(top / 16)
    const animate = () => {
      if (top <= 0) {
        doc.scrollTop = 0
      } else {
        top -= step
        doc.scrollTop = top
        window.requestAnimationFrame(animate)
      }
    }
    window.requestAnimationFrame(animate)
  }
}