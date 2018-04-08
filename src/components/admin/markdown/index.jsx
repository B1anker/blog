import React, { Component } from 'react'
import Prism from 'prismjs'
import Editor from './editor'
import Renderer from './renderer'
import { MarkDownStyle, SubmitStyle } from './style'
import { message } from 'antd'
import api from '@/http/api'

export default class MarkDown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      parsable: false
    }
    this.headers = []
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
    React.$http.post(api.post.add, {
      ...this.headers,
      ...{
        content: this.state.value
      }
    }).then((res) => {
      message.success('新增文章成功！')
      console.log(res)
    })
  }
}
