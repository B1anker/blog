import React, { Component } from 'react'
import Prism from 'prismjs'
import Editor from './editor'
import Renderer from './renderer'
import { MarkDownStyle, SubmitStyle } from './style'

export default class MarkDown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      parsable: false
    }
  }

  render () {
    return (
      <MarkDownStyle>
        <Editor value={this.state.value}
          onChange={(value) => this.setState({value})} />
        <Renderer value={this.state.value}
          parsable={this.state.parsable}
          onChange={(parsable) => this.setState({parsable})}/>
        <SubmitStyle type='primary' disabled={!this.state.parsable}>提交</SubmitStyle>
      </MarkDownStyle>
    )
  }
}
