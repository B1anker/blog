import React, { Component } from 'react'

export default class Disqus extends Component {
  public componentDidMount () {
    const doc = document
    const s = doc.createElement('script')
    s.src = 'https://b1anker.disqus.com/embed.js'
    s.setAttribute('data-timestamp', new Date().getTime().toString())
    if (doc.head) {
      doc.head.appendChild(s)
    } else if (doc.body) {
      doc.body.appendChild(s)
    }
  }

  public render () {
    return <div id="disqus_thread">翻墙食用评论...</div>
  }
}
