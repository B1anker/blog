import React, { Component } from 'react'
import Header from '@/components/blog/header'
import Post from '@/components/blog/post'
import { Container } from './style'

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
        <Header/>
        <Container>
          {
            this.state.posts.map((post, index) => <Post value={post.summary} key={index} />)
          }
        </Container>
      </div>
    )
  }
}
