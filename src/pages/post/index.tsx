import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Header from '@/components/blog/header'
import MyFooter from '@/components/blog/footer'
import Scroll from '@/components/blog/scroll'
import Disqus from '@/components/blog/disqus'
import Content from '../home/content'
import ExtendComponent from '@/core/component';

interface RouteParmas {
  pid: string | undefined
}

export interface Post {
  id: number
  summary: string
  content: string
  createTime: number
  updateTime: number
}

interface PostPageState {
  posts: Post[]
  loading: boolean
}

export default class PostPage extends ExtendComponent<RouteComponentProps<RouteParmas>, PostPageState> {
  constructor (props) {
    super(props)
    this.state = {
      posts: [],
      loading: false
    }
  }

  get pid () {
    return this.props.match.params.pid
  }

  async componentDidMount () {
    this.setState({
      loading: true
    })
    const { data } = await this.$models.post.fetchPost(this.pid)
    this.setState({
      posts: data,
      loading: false
    })
  }

  render () {
    return (
      <div className="post-page">
        <Header />
        <Content type='content'
          posts={ this.state.posts }
          comment={ <Disqus /> as any }
          loading={this.state.loading}/>
        <MyFooter />
        <Scroll />
      </div>
    )
  }
}
