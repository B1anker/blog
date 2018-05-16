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
  }

  get scrollHandler () {
    return throttle(this.scroll.bind(this), 300)
  }

  componentDidMount () {
    window.addEventListener('scroll', this.scrollHandler)
  }

  componentWillUnmount () {
    this.unmount = true
    this.scrollHandler.cancel()
    window.removeEventListener('scroll', this.scrollHandler)
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

  scroll (e) {
    if (this.unmount) {
      return
    }
    const top = document.documentElement.scrollTop
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