import React, { Component } from 'react'
import Profile from '@/components/blog/profile'
import Post from '@/components/blog/post'
import { ContentStyle } from './style'
import pick from 'lodash/pick'

export default class Content extends Component {
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
      <ContentStyle>
        <div className="posts">
          {
            this.state.posts.map((post, index) => {
              const _post = pick(post, [
                'title',
                'tags',
                'subTitle',
                'catagory'
              ])
              Object.assign(_post, {
                id: post._id,
                render: post.summary,
                createTime: post.meta.createAt,
                updateTime: post.meta.updateAt
              })
              return <Post post={_post} key={index} />
            })
          }
        </div>
        <div className="sidebar">
          <Profile />
        </div>
      </ContentStyle>
    )
  }
}