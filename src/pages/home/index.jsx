import React, { Component } from 'react'
import Header from '@/components/blog/header'
import MyFooter from '@/components/blog/footer'
import Scroll from '@/components/blog/scroll'
import Content from './content'

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      posts: []
    }
  }

  async componentDidMount () {
    const { data } = await this.$models.post.fetchPostList()
    this.setState({
      posts: data
    })
  }

  render () {
    return (
      <div className='home'>
        <Header />
        <Content
          type='summary'
          posts={this.state.posts}/>
        <MyFooter />
        <Scroll />
      </div>
    )
  }
}
