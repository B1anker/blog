import ExtendComponent from '@/core/component'
import { Icon, Spin } from 'antd'
import CodeMirror from 'codemirror'
import React from 'react'
import Editor from './Editor'
import Renderer from './Renderer'
import { MarkDownStyle } from './style'
import UploadImage, { Resource } from './UploadImage'

export interface MarkDownProps {
  pid: string
  height: number
  value: string
  loading: boolean
  onChange: (value: string) => void
}

interface MarkDownState {
  disabled: boolean
  submitting: boolean
  uploadVisible: boolean
  files: File[]
}

export default class MarkDown extends ExtendComponent<
  MarkDownProps,
  MarkDownState
> {
  private line: number = 0
  private ch: number = 0
  public constructor (props: MarkDownProps) {
    super(props)
    this.state = {
      disabled: true,
      submitting: false,
      uploadVisible: false,
      files: []
    }
  }

  public render () {
    return (
      <MarkDownStyle height={this.props.height}>
        {
          <Spin
            spinning={this.props.loading}
            indicator={
              <Icon type="loading" style={{ fontSize: 24 }} spin={true} />
            }
          >
            <div className="container">
              <Editor
                value={this.props.value}
                height={this.props.height}
                pid={this.props.pid}
                onChange={(value) => this.props.onChange(value)}
                onDrop={(files, cursor) => this.handleOnDrop(files, cursor)}
              />
              <Renderer value={this.props.value} />
            </div>
          </Spin>
        }
        <UploadImage
          visible={this.state.uploadVisible}
          files={this.state.files}
          onCancel={(resources) => this.handleOnCancelUplaod(resources)}
        />
      </MarkDownStyle>
    )
  }

  private handleOnDrop (files: File[], cursor: CodeMirror.Position) {
    this.setState({
      uploadVisible: true,
      files
    })
    this.line = cursor.line
    this.ch = cursor.ch
  }

  private handleOnCancelUplaod (resources: Resource[]) {
    if (Array.isArray(resources)) {
      const value = this.props.value
      const lines = value.split('\n')
      const line = lines[this.line]
      lines[this.line] = line.slice(0, this.ch) + resources.map(({ name, url }) => {
        return `![${name}](${url})`
      }).join('\n') + line.slice(this.ch)
      this.props.onChange(lines.join('\n'))
    }
    this.setState({
      uploadVisible: false
    })
  }
}
