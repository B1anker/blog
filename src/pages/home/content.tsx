import { Icon, Spin } from 'antd'
import React, { Component } from 'react'
import Profile from '@/components/blog/profile'
import Post from '@/components/blog/post'
import { ContentStyle } from './style'
import pick from 'lodash/pick'

interface ContentProps {
  posts: any[]
  type: string
  loading: boolean
  comment?: React.Component
}

export default class Content extends Component<ContentProps> {
  render () {
    const Posts = <div className="posts">
      {
        this.props.posts.length ? this.props.posts.map((post, index) => {
          const _post = pick(post, [
            'title',
            'tags',
            'subTitle',
            'categories',
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
        }) : <div className="empty">暂无文章╮(╯_╰)╭</div>
      }
    </div>

    return (
      <ContentStyle className='main-content'>
        {
          this.props.loading ? <div className="loading">
            <Spin wrapperClassName="spin" indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
          </div> : Posts
        }
        <div className="sidebar">
          <Profile />
        </div>
        {
          this.props.comment ? (
            <div className="post-comment">
              { this.props.comment }
            </div>
          ) : null
        }
      </ContentStyle>
    )
  }
}