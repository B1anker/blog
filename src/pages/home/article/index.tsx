import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ExtendComponent from '@/core/component'
import Articles from '../articles'

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

  render () {
    return (
      <div className="post-page">
        <Articles pathname={this.props.location.pathname}
          pid={this.pid}
        />
      </div>
    )
  }
}
