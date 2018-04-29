import React, { Component } from 'react'
import Editor from './editor'
import Renderer from './renderer'
import { MarkDownStyle, SubmitStyle } from './style'
import { message } from 'antd'

export default class MarkDown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      parsable: false
    }
    this.headers = []
  }

  get pid () {
    return this.props.match.params.pid
  }

  async componentDidMount () {
    if (this.pid) {
      const { data } = await this.$models.post.fetchPost(this.pid)
      this.setState({
        value: data[0].content
      })
    }
  }

  render () {
    return (
      <MarkDownStyle>
        <Editor value={this.state.value}
          onChange={(value) => this.setState({value})} />
        <Renderer value={this.state.value}
          parsable={this.state.parsable}
          onChange={({parsable, headers}) => {
            this.headers = headers
            this.setState({parsable})
          }}/>
        <SubmitStyle type='primary'
          disabled={!this.state.parsable}
          onClick={() => {
            this.handleSubmit()
          }}>
          提交
        </SubmitStyle>
      </MarkDownStyle>
    )
  }

  handleSubmit () {
    this.$models.post.addPost({
      ...this.headers,
      ...{
        content: this.state.value
      }
    }).then((res) => {
      message.success('新增文章成功！')
      this.props.history.push(`/admin/post/list`)
    })
  }
}
