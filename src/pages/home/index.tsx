import React from 'react'
import Header from '@/components/blog/header'
import MyFooter from '@/components/blog/footer'
import Scroll from '@/components/blog/scroll'
import Content from './content'
import ExtendComponent from '@/core/component';

export default class Home extends ExtendComponent {
  constructor (props) {
    super(props)
    this.state = {
      posts: [],
      loading: false
    }
  }

  async componentDidMount () {
    this.setState({
      loading: true
    })
    try {
      const { data } = await this.$models.post.fetchPostList()
      this.setState({
        posts: data,
        loading: false
      })
    } catch (err) {
      this.setState({
        posts: [],
        loading: false
      })
      throw err
    }
  }

  render () {
    return (
      <div className='home'>
        <Header />
        <Content type='summary'
          loading={this.state.loading}
          posts={this.state.posts}/>
        <MyFooter />
        <Scroll />
      </div>
    )
  }
}
