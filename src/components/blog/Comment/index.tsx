import Gitalk from 'gitalk'
import 'gitalk/dist/gitalk.css'
import React, { useEffect } from 'react'

const gitalk = new Gitalk({
  clientID: 'de962cf57c14d7fb416f',
  clientSecret: '0cb4e3373e606140d5a9b610c9349dc128cae495',
  repo: 'blog-comment',
  owner: 'b1anker',
  admin: ['b1anker'],
  id: location.pathname,
  distractionFreeMode: false
})

const Comment = (props) => {
  useEffect(() => {
    gitalk.render('gitalk-container')
  })
  return <div id="gitalk-container" />
}

export default Comment
