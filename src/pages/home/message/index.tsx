import Comment from '@/components/blog/Comment'
import React from 'react'
import { MessageStyle } from './style'

const Message = () => {
  return [
    <MessageStyle className="message" key={0}>
      <h1>留言板</h1>
      <p>大佬们请说话...</p>
      <img src={require('@/assets/ding.jpg')} alt="盯..."/>
    </MessageStyle>,
    <MessageStyle key={1}>
      <Comment />
    </MessageStyle>
  ]
}

export default Message
