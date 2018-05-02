import React, { Component } from 'react'
import Navigator from '../navigator'
import { Blur, Poster } from './style'

export default class Header extends Component {
  render () {
    return (
      <header>
        <Navigator />
        <Blur />
        <Poster className="poster" />
      </header>
    )
  }
}
