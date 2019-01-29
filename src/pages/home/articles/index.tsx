import Disqus from '@/components/blog/disqus'
import Post from '@/components/blog/post'
import ExtendComponent from '@/core/component'
import { Icon, Spin } from 'antd'
import pick from 'lodash/pick'
import React from 'react'
import ArticleStyle from './style'

interface ArticlesProps {
  pathname: string
  pid?: string
}

interface ArticlesState {
  loading: boolean
  posts: any[]
}

export default class Articles extends ExtendComponent<ArticlesProps, ArticlesState> {
  constructor (props) {
    super(props)
    this.state = {
      posts: [],
      loading: false
    }
  }

  private get type () {
    if (this.props.pathname !== '/') {
      return 'full'
    }
    return 'summary'
  }

  public async componentDidMount () {
    this.getPosts()
  }

  public render () {
    const Posts = <div className="posts">
      {
        this.state.posts.length ? this.state.posts.map((post, index) => {
          const innerPost = pick(post, [
            'title',
            'tags',
            'subTitle',
            'categories',
            'count'
          ])
          Object.assign(innerPost, {
            id: post._id,
            render: this.type === 'summary' ? post.summary : post.content,
            createTime: post.meta.createdAt,
            updateTime: post.meta.updatedAt
          })
          return <Post
            post={innerPost}
            key={index}
            type={this.type} />
        }) : <div className="empty">暂无文章╮(╯_╰)╭</div>
      }
    </div>

    return (
      <ArticleStyle className="articles">
        {
          this.state.loading ? <div className="loading">
            <Spin wrapperClassName="spin"
              tip="加载文章中..."
              indicator={<Icon type="loading" style={{ fontSize: 24 }} spin={true} />}
            />
          </div> : Posts
        }
        {
          this.type !== 'summary' ? (
            <div className="post-comment">
              <Disqus />
            </div>
          ) : null
        }
      </ArticleStyle>
    )
  }

  private async getPosts () {
    this.setState({
      loading: true
    })
    try {
      let data
      if (typeof this.props.pid === 'string') {
        data = (await this.$models.post.fetchPost(this.props.pid)).data
      } else {
        data = (await this.$models.post.fetchPostList()).data
      }
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
}
