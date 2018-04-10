import React, { Component } from 'react'
import { ProfileStyle } from './style'


export default class Profile extends Component {
  socials = [{
    name: 'Github',
    icon: 'github',
    url: 'https://github.com/b1anker'
  }, {
    name: '哔哩哔哩',
    icon: 'bilibili',
    url: 'https://space.bilibili.com/439765/#/'
  }, {
    name: '网易云',
    icon: 'music',
    url: 'https://music.163.com/#/user/home?id=85989847'
  }]

  render () {
    return (
      <ProfileStyle> 
        <div className='avatar' ></div>
        <ul className='social'>
          {
            this.socials.map((social, index) => (
              <li className='social-item' key={index}>
                <i className={`icon iconfont icon-${social.icon}`}></i>
              </li>
            ))
          }
        </ul>
      </ProfileStyle>
    )
  }
}