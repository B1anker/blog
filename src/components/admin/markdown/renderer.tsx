import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import CodeBlock from './prism'
import { RendererStyle } from './style'

/* 去掉
  * ---
  * xxx...
  * ---
  * 中的
  * ---
  */
const removeInfoFlag = (string) => {
  return string.replace(/---/g, '')
    .split('\n')
    .filter((param) => !!param) // 过滤空置
    .map((param) => param.trim())
}

/*
  * 过滤数组形式和非数组形式的值,如
  * 1.数组形式:
  * tags:
  *  - 123
  *  - 456
  * 2.非数组形式：
  * title: xxxx
  */
const seperateLinesToArrayLikeAndNotArrayLike = (perLineStore) => {
  const arrayLikeOfLine: string[] = []
  const notArrayLikeOfLine: string[] = []
  perLineStore.forEach((line) => {
    if (line.split(': ').length < 2 || !line.split(': ')[1]) {
      arrayLikeOfLine.push(line)
    } else {
      notArrayLikeOfLine.push(line)
    }
  })
  return {
    arrayLikeOfLine,
    notArrayLikeOfLine
  }
}

const handleArrayLike = (arrayLikeOfLine) => {
  interface Temp {
    name: string
    value: string[]
  }
  const temp: Temp = {
    name: '',
    value: []
  }
  const arrayLike: any[] = []
  // 处理数组形式的组
  for (let i = 0, len = arrayLikeOfLine.length; i < len; i++) {
    const currentLine = arrayLikeOfLine[i]
    if (~currentLine.search(':')) {
      if (i > 0) {
        arrayLike.push(Object.assign({}, temp))
        temp.value = []
      }
      temp.name = currentLine.match(/.*(?=:)/)[0]
    } else {
      temp.value.push(currentLine.match(/(?!-)\s*(.*)/)[1])
    }
  }
  temp.name && arrayLike.push(Object.assign({}, temp))
  return arrayLike
}

const handleNotArrayLike = (notArrayLikeOfLine) => {
  return notArrayLikeOfLine.map((str) => {
    return {
      name: str.split(': ')[0],
      value: str.split(': ')[1]
    }
  })
}

const generateHeaders = (result) => {
  const headers = {}
  result.forEach((r) => {
    if (typeof r.value === 'string') {
      headers[r.name] = r.value.trim()
    } else {
      headers[r.name] = r.value.map((v) => v.trim())
    }
  })
  return headers
}

const convertValue = (value) => {
  if (!value) {
    return {
      parsable: false
    }
  }
  try {
    const removeMore = value.replace(/<!--\s?more\s?-->/, '')
    const summary = value.split(/<!--\s?more\s?-->/)[0] || value
    const paramsString = removeMore.match(/---\n(.|\n)*\n---/)
    let result
    // 解析头部信息
    if (paramsString && paramsString[0]) {
      // 去掉---
      const perLineStore = removeInfoFlag(paramsString[0])
      const { arrayLikeOfLine, notArrayLikeOfLine } = seperateLinesToArrayLikeAndNotArrayLike(perLineStore)
      const arrayLike = handleArrayLike(arrayLikeOfLine)
      const notArrayLike = handleNotArrayLike(notArrayLikeOfLine)

      result = notArrayLike.concat(arrayLike).concat({
        name: 'summary',
        value: summary
      })
    }
    const headers = generateHeaders(result)
    return {
      renderValue: removeMore.replace(/---\n(.|\n)*\n---/g, ''),
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

interface RendererProps {
  value: string
  parsable: boolean
  onChange: ({parsable, headers}) => void
}

interface RendererState {
  renderValue: string
  value: string
}

export default class Renderer extends Component<RendererProps, RendererState> {
  constructor (props) {
    super(props)
    this.state = {
      renderValue: '',
      value: ''
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { renderValue, headers, parsable } = convertValue(nextProps.value)
    if (prevState.value !== nextProps.value) {
      nextProps.onChange({
        parsable,
        headers
      })
    }
    return {
      renderValue,
      value: nextProps.value
    }
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