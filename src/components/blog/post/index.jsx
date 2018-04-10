import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { PostStyle } from './style'
import CodeBlock from '@/components/admin/markdown/codeBlock'
import moment from 'moment'

export default class Post extends Component {
  get post () {
    return this.props.post
  }

  render () {
    const date = moment(this.post.createTime)
    return (
      <PostStyle>
        <div className="post-header">
          <h1 className="post-title">
            <Link className="post-title-link" to={`/post/${this.post.id}`}>
              { this.post.title }
            </Link>
          </h1>
          <div className="post-meta">
            <div className="published">
              <i className="iconfont icon-calendar"></i>
              <span className="prefix">发表于</span>
              &nbsp;&nbsp;
              <span className="text">
                { date.format('YYYY-MM-DD') }
              </span>
            </div>
            <span className='split'>•</span>
            <div className="category">
              <i className="iconfont icon-folder"></i>
              <span className="prefix">分类于</span>
              &nbsp;&nbsp;
              <span className="text">
                { this.post.catagory }
              </span>
            </div>
            <span className='split'>•</span>
            <div className="visited">
              <i className="iconfont icon-eye"></i>
              <span className="prefix">阅读次数</span>
              &nbsp;&nbsp;
              <span className="text">3879</span>
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
        <ReactMarkdown source={ this.convertRenderValue(this.post.render) }
          className="post-content"
          skipHtml={false}
          escapeHtml={false}
          renderers={{code: CodeBlock}}/>
        <div className="post-badage">
          <span>{ this.post.catagory }</span>
        </div>
        <div className="read-all">
          <Link className="btn" to={`/post/${this.post.id}`}>
            阅读全文 &raquo;
          </Link>
        </div>
      </PostStyle>
    )
  }

  convertRenderValue (value) {
    const removeMore = value.replace(/<!-- more -->/, '')
    return removeMore.replace(/---\n(.|\n)*\n---/g, '')
  }
}