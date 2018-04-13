import React, { Component } from 'react'
import { FooterStyle } from './style'

export default class MyFooter extends Component {
  render () {
    return (
      <FooterStyle>
        <div className="footer-image"></div>
        <p>© 2018 Hi, B1anker. 抄袭于Diygod. Theme By Sagiri v0.0.16.</p>
        <p>站点地图. 粤ICP备16024121号.</p>
        <p>Made with  by B1anker.</p>
      </FooterStyle>
    )
  }
}