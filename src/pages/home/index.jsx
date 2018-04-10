import React, { Component } from 'react'
import Header from '@/components/blog/header'
import Post from '@/components/blog/post'
import MyFooter from '@/components/blog/footer'
import Content from './content'

export default class Home extends Component {
  render () {
    return (
      <div className='home'>
        <Header />
        <Content className="content" />
        <MyFooter />
      </div>
    )
  }
}
