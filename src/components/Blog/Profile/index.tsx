import React, { Component } from 'react'

import { ProfileStyle } from './style'

export interface SocialItem {
  name: string
  icon: string
  url: string
}
export default class Profile extends Component {
  private socials: SocialItem[] = [{
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
  }, {
    name: '谷歌邮箱',
    icon: 'gmail',
    url: 'mailto:narutowontstop@gmail.com'
  }]

  public render () {
    return (
      <ProfileStyle>
        <div className="avatar" />
        <div className="username">B1anker</div>
        <p>与食俱进，贱多识广</p>
        <ul className="social">
          {
            this.socials.map((social, index) => (
              <li className="social-item" key={index}>
                <a href={social.url} target="_blank">
                  <i className={`icon iconfont icon-${social.icon}`} />
                </a>
                <div className="tooltip">
                  <div className="text">{ social.name }</div>
                  <div className="arrow" />
                </div>
              </li>
            ))
          }
        </ul>
      </ProfileStyle>
    )
  }
}
