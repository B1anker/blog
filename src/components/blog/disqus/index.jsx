import React, { Component } from 'react'

export default class Disqus extends Component {
  componentDidMount () {
    const doc = document
    const s = doc.createElement('script')
    s.src = 'https://b1anker.disqus.com/embed.js'
    s.setAttribute('data-timestamp', +new Date())
    ;(doc.head || doc.body).appendChild(s)
  }

  render () {
    return (
      <div id="disqus_thread"></div>
    )
  }
}