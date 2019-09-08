import CodeBlock from '@/components/Admin/Markdown/Prism'
import { PostModel } from '@/models/posts'
import moment from 'moment'
import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import Popup from './Popup'
import { PostStyle } from './style'

export interface InnerPost extends PostModel {
  render: string
}

export interface PostProps {
  post: InnerPost
  type: string
}

interface PostState {
  popupImage: boolean
  imgUrl: string
}

export default class Post extends Component<PostProps, PostState> {
  private contentRef: React.RefObject<HTMLDivElement> = React.createRef()
  private get post () {
    return this.props.post
  }

  constructor (props) {
    super(props)
    this.state = {
      popupImage: false,
      imgUrl: ''
    }
    this.contentRef = React.createRef()
  }

  public componentDidMount () {
    if (this.contentRef && this.contentRef.current) {
      Array.from(this.contentRef.current.querySelectorAll('img'))
        .forEach((el) => {
          if (el.parentElement) {
            el.parentElement.style.textIndent = '0'
          }
        })
    }
  }

  public render () {
    const date = moment.unix(this.post.created)
    const readMore = (
      <div className="read-all">
        <Link className="btn"
          to={`/post/${this.post.id}`}
        >
          阅读全文 &raquo;
        </Link>
      </div>
    )
    return (
      <PostStyle className="post">
        <div className="post-header">
          <h1 className="post-title">
            <Link className="post-title-link" to={`/post/${this.post.id}`}>
              { this.post.title }
            </Link>
          </h1>
          <div className="post-meta">
            <div className="published">
              <i className="iconfont icon-calendar" />
              <span className="prefix">发表于</span>
              &nbsp;&nbsp;
              <span className="text">
                { date.format('YYYY-MM-DD') }
              </span>
            </div>
            <span className="split">•</span>
            <div className="category">
              <i className="iconfont icon-folder" />
              <span className="prefix">分类于</span>
              &nbsp;&nbsp;
              <span className="text">
                { this.post.categories.map(({ name }) => name).join(',')  }
              </span>
            </div>
            <span className="split">•</span>
            <div className="visited">
              <i className="iconfont icon-eye" />
              <span className="prefix">阅读次数</span>
              &nbsp;&nbsp;
              <span className="text">
                { this.post.views || 0 }
              </span>
            </div>
          </div>
        </div>
        <div className="post-date">
          <div className="post-month">
            { date.format('M') }月
          </div>
          <div className="post-day">
            { date.format('D') }
          </div>
        </div>
        <Popup>
          <div className="post-content"
            ref={this.contentRef}>
            <ReactMarkdown source={ this.convertRenderValue(this.post.render) }
              skipHtml={false}
              escapeHtml={false}
              renderers={{code: CodeBlock}}/>
          </div>
        </Popup>
        <div className="post-badage">
          <span>{ this.post.categories.map(({ name }) => name).join(',') }</span>
        </div>
        {
          this.props.type === 'summary' ? readMore : null
        }
      </PostStyle>
    )
  }

  private convertRenderValue (value) {
    const removeMore = value.replace(/<!-- more -->/, '')
    return removeMore.replace(/---\n(.|\n)*\n---/g, '')
  }
}
