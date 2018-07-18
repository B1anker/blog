import prism from 'prismjs'
import React, { Component } from 'react'

import '../../../styles/lib/code.less'
// import 'highlightjs/styles/solarized_light.css'

export default class CodeBlock extends Component {
  constructor (props) {
    super(props)
  }

  highlight (str, lang) {
    let result = ''
    try {
      result = prism.highlight(str, prism.languages[lang], lang)
    } catch (err) {
      console.log(str, lang)
    }
    return result
  }

  render () {
    const { value, language } = this.props
    return (
      <pre className='prism-highlight'>
        <code ref={(el) => this.el = el}
          dangerouslySetInnerHTML={ {__html: this.highlight(value, language || 'vim')} }
          className={`language-${language || 'vim'}`}
        />
      </pre>
    )
  }
}
