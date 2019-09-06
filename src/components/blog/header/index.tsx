import React, { Component } from 'react'
import Navigator from '../Navigator'
import { Blur, Poster } from './style'

export default class Header extends Component {
  public render () {
    return (
      <header>
        <Navigator />
        <Blur />
        <Poster className="poster" />
      </header>
    )
  }
}
