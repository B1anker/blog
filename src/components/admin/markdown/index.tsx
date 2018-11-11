import ExtendComponent from '@/core/component'
import { Icon, Spin } from 'antd'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Editor from './editor'
import Renderer from './renderer'
import { MarkDownStyle, SubmitStyle } from './style'
import { message } from 'antd'

export interface Params {
  pid: number
}

interface MarkDownState {
  value: string
  parsable: boolean
  submitting: boolean
  loading: boolean
}

export default class MarkDown extends ExtendComponent<RouteComponentProps<Params>, MarkDownState> {
  private headers: any[] = []

  constructor (props) {
    super(props)
    this.state = {
      value: '',
      parsable: false,
      submitting: false,
      loading: !!props.match.params.pid
    }
  }

  get isEdit () {
    return !!this.props.match.params.pid
  }

  get pid () {
    return this.props.match.params.pid
  }

  async componentDidMount () {
    if (this.pid) {
      const { data } = await this.$models.post.fetchPost(this.pid)
      this.setState({
        value: data[0].content,
        loading: false
      })
    }
  }

  render () {
    const container = (
      <div className="container">
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
            loading={this.state.submitting}
            onClick={() => {
              this.handleSubmit()
            }}>
            { this.isEdit ? '修改' : '提交' }
          </SubmitStyle>
      </div>)
    return (
      <MarkDownStyle>
        {
          this.state.loading ? <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} >
            {container}
          </Spin> : container
        }
      </MarkDownStyle>
    )
  }

  finish (res) {
    const successText = this.isEdit ? '修改' : '提交' + '文章成功！'
    message.success(successText)
    this.props.history.push(`/admin/post/list`)
    this.setState({
      submitting: false
    })
  }

  handleSubmit () {
    this.setState({
      submitting: true
    })
    if (this.isEdit) {
      this.$models.post.updatePost({
        pid: this.pid,
        ...this.headers,
        ...{
          content: this.state.value
        }
      }).then((res) => {
        this.finish(res)
      })
    } else {
      this.$models.post.addPost({
        ...this.headers,
        ...{
          content: this.state.value
        }
      }).then((res) => {
        this.finish(res)
      })
    }
  }
}
