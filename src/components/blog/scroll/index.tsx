import React, { Component } from 'react'
import { ScrollStyle } from './style'
import { connect, DispatchProp } from 'react-redux'
import { changeScrollStatus } from '../../../actions/system'
import throttle from 'lodash/throttle'
import { Cancelable } from 'lodash'

interface ScrollState {
  active: boolean
}

class Scroll extends Component<DispatchProp, ScrollState> {
  private unmount: boolean
  private throttled: ((...args: any[]) => any) & Cancelable
  private app: HTMLElement | null

  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
    this.unmount = false
    this.throttled = throttle(this.scroll, 300)
  }

  public componentDidMount () {
    this.app = document.querySelector('#app')
    if (this.app) {
      this.app.addEventListener('scroll', this.throttled.bind(this))
    }
  }

  public componentWillUnmount () {
    this.unmount = true
    this.throttled.cancel()
    if (this.app) {
      this.app.removeEventListener('scroll', this.throttled.bind(this))
    }
  }

  public shouldComponentUpdate (prevProps, prevState) {
    if (this.state.active === prevState.active) {
      return false
    }
    return true
  }

  public render () {
    return (
      <ScrollStyle className={`scroll ${this.state.active ? 'active' : ''}`}
        onClick={() => this.scrollToTop()} />
    )
  }

  private scroll () {
    if (this.unmount) {
      return
    }
    const app = document.querySelector('#app')
    if (app) {
      const top = app.scrollTop
      if (top > 100) {
        this.props.dispatch(changeScrollStatus(true))
        this.setState({
          active: true
        })
      } else {
        this.props.dispatch(changeScrollStatus(false))
        this.setState({
          active: false
        })
      }
    }
  }

  scrollToTop () {
    if (this.app) {
      let top = this.app.scrollTop
      const step = Math.ceil(top / 16)
      const animate = () => {
        if (top <= 0) {
          if (this.app) {
            this.app.scrollTop = 0
          }
        } else {
          if (this.app) {
            top -= step
            this.app.scrollTop = top
            window.requestAnimationFrame(animate)
          }
        }
      }
      window.requestAnimationFrame(animate)
    }
  }
}

export default connect()(Scroll)