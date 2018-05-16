import React, { Component } from 'react'
import { PostPageStyled } from './style'
import Header from '@/components/blog/header'
import MyFooter from '@/components/blog/footer'
import Scroll from '@/components/blog/scroll'
import Content from '../home/content'

export default class PostPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      posts: []
    }
  }

  get pid () {
    return this.props.match.params.pid
  }

  async componentDidMount () {
    const { data } = await this.$models.post.fetchPost(this.pid)
    this.setState({
      posts: data
    })
  }

  render () {
    return (
      <div className="post-page">
        <Header />
        <Content type='content' posts={this.state.posts}/>
        <MyFooter />
        <Scroll />
      </div>
    )
  }
}