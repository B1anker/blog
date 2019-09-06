import Comment from '@/components/Blog/Comment'
import React from 'react'
import { MessageStyle } from './style'

const Message = () => {
  return <div className="message">
    <MessageStyle key={0}>
      <h1>留言板</h1>
      <p>大佬们请说话...</p>
      <img src={require('@/assets/ding.jpg')} alt="盯..."/>
    </MessageStyle>,
    <MessageStyle key={1}>
      <Comment />
    </MessageStyle>
  </div>
}

export default Message
