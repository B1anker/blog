import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import CodeBlock from './codeBlock'
import { RendererStyle } from './style'

const convertValue = (value) => {
  if (!value) {
    return {
      parsable: false
    }
  }
  try {
    const removeMore = value.replace(/<!-- more -->/, '')
    const summary = value.split(/<!-- more -->/)[0] || value
    const paramsString = removeMore.match(/---(.|\n)*---/g)
    let result = []
    // 解析头部信息
    if (paramsString && paramsString[0]) {
      // 去掉---
      result = paramsString[0].replace(/---/g, '').split('\n')
      // 去掉切割换行符之后空白符
      result = result.filter((r) => {
        return !!r
      })

      result = result.map((r) => {
        return r = r.trim()
      })

      /*
       * 过滤数组形式的值,如
       * tags:
       *  - 123
       *  - 456
       */
      const array = result.filter((r) => {
        return r.split(':').length < 2 || !r.split(':')[1]
      })

      // 过滤非数组形式的值
      result = result.filter((r) => {
        return !(r.split(':').length < 2 || !r.split(':')[1])
      })

      const o = {
        name: '',
        value: []
      }
      const arrLike = []
      // 处理数组形式的组
      for (let i = 0, len = array.length; i < len; i++) {
        const cur = array[i]
        if (~cur.search(':')) {
          if (i > 0) {
            arrLike.push(Object.assign({}, o))
            o.value = []
          }
          o.name = cur.match(/.*(?=:)/)[0]
        } else {
          o.value.push(cur.match(/(?!-)\s*(.*)/)[1])
        }
      }
      o.name && arrLike.push(Object.assign({}, o))

      result = result.map((r) => {
        return {
          name: r.split(':')[0],
          value: r.split(':')[1]
        }
      }).concat(arrLike).concat({
        name: 'summary',
        value: summary
      })
    }
    const headers = {}
    result.forEach((r) => {
      headers[r.name] = r.value
    })
    return {
      renderValue: removeMore.replace(/---(.|\n)*---/g, ''),
      parsable: true,
      headers
    }
  } catch (err) {
    console.log(err)
    return {
      parsable: false
    }
  }
}

export default class Renderer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      renderValue: ''
    }
  }

  componentDidMount () {
    this.props.onChange(!this.props.value)
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { renderValue, headers, parsable } = convertValue(nextProps.value)
    if (parsable !== nextProps.parsable) {
      nextProps.onChange({
        parsable,
        headers
      })
    }
    return {
      renderValue
    }
  }

  componentDidCatch (e) {
    console.log(e)
  }
  
  render () {
    return (
      <RendererStyle>
        <ReactMarkdown source={ this.state.renderValue }
          className="renderer"
          skipHtml={false}
          escapeHtml={false}
          renderers={{code: CodeBlock}}/>
      </RendererStyle>
    )
  }
}