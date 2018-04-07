import React, { Component } from 'react'
import Header from '../../components/blog/header'
import { Container } from './style'

export default class Home extends Component {
  render () {
    return (
      <div className='home'>
        <Header/>
        <Container />
      </div>
    )
  }
}
