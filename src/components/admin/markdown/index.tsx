import ExtendComponent from '@/core/component'
import { Icon, Spin } from 'antd'
import React from 'react'
import Editor from './editor'
import Renderer from './renderer'
import { MarkDownStyle } from './style'

export interface MarkDownProps {
  pid: string
  height?: number
  value: string
  onChange: (value: string) => void
  loading: boolean
}

interface MarkDownState {
  disabled: boolean
  submitting: boolean
}

export default class MarkDown extends ExtendComponent<MarkDownProps, MarkDownState> {
  public constructor (props: MarkDownProps) {
    super(props)
    this.state = {
      disabled: true,
      submitting: false
    }
  }

  public render () {
    const container = (
      <div className="container">
        <Editor value={this.props.value}
          onChange={(value) => this.props.onChange(value)}
        />
        <Renderer value={this.props.value} />
      </div>)
    return (
      <MarkDownStyle height={this.props.height}>
        {
          this.props.loading ? <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin={true} />} >
            {container}
          </Spin> : container
        }
      </MarkDownStyle>
    )
  }
}
