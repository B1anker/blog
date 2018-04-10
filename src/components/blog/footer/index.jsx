import React, { Component } from 'react'
import { FooterStyle } from './style'

export default class MyFooter extends Component {
  render () {
    return (
      <FooterStyle>
        <div className="footer-image"></div>
        <p>© 2018 Hi, B1anker. 由 Hexo 强力驱动. Theme By Sagiri v0.0.16. 站点地图. 鲁ICP备16000184号.</p>
      </FooterStyle>
    )
  }
}