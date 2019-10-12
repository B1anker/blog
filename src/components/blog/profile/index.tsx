import React, { useEffect, useState } from 'react'

import analyzeModel from '@/models/analyze'
import { ProfileStyle } from './style'

export interface SocialItem {
  name: string
  icon: string
  url: string
}

const socials: SocialItem[] = [{
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

const Profile  = () => {
  const [analyze, setAnalyze] = useState({pv: 0, uv: 0})

  useEffect(() => {
    Promise.all([analyzeModel.pv(), analyzeModel.uv()]).then(([pvResponse, uvResponse]) => {
      setAnalyze({
        pv: pvResponse.data.data.pv,
        uv: uvResponse.data.data.uv
      })
    })
  }, [])

  return (
    <ProfileStyle>
      <div className="avatar" />
      <div className="username">B1anker</div>
      <p>与食俱进，贱多识广</p>
      <ul className="social">
        {
          socials.map((social, index) => (
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
      <div className="analyze">pv: {analyze.pv.toString()}, uv: {analyze.uv.toString()}</div>
    </ProfileStyle>
  )
}

export default Profile
