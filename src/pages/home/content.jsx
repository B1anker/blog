import React, { Component } from 'react'
import Profile from '@/components/blog/profile'
import Post from '@/components/blog/post'
import Disqus from '@/components/blog/disqus'
import { ContentStyle } from './style'
import pick from 'lodash/pick'

export default class Content extends Component {
  render () {
    return (
      <ContentStyle className='main-content'>
        <div className="posts">
          {
            this.props.posts.map((post, index) => {
              const _post = pick(post, [
                'title',
                'tags',
                'subTitle',
                'category',
                'count'
              ])
              Object.assign(_post, {
                id: post._id,
                render: this.props.type === 'summary' ? post.summary : post.content,
                createTime: post.meta.createdAt,
                updateTime: post.meta.updatedAt
              })
              return <Post
                post={_post}
                key={index}
                type={this.props.type} />
            })
          }
        </div>
        <div className="sidebar">
          <Profile />
        </div>
        {
          this.props.comment ? (<div className="post-comment">{ this.props.comment }</div>) : null
        }
      </ContentStyle>
    )
  }
}