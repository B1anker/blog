import React, { Component } from 'react'
import { FooterStyle } from './style'

const BLOG_START_DATE = '2018-04-13 22:57:50'
const DAY_GAP = 1000 * 60 * 60 * 24
const HOUR_GAP = 1000 * 60 * 60
const MINUTE_GAP = 1000 * 60
const SECOND_GAP = 1000

export default class MyFooter extends Component {
  constructor (props) {
    super(props)
    this.blogStartTimestamp = new Date(BLOG_START_DATE).getTime()
    this.state = {
      gap: (new Date()).getTime() - this.blogStartTimestamp
    }
  }

  componentDidMount () {
    setInterval(() => {
      this.setState({
        gap: (new Date()).getTime() - this.blogStartTimestamp
      })
    }, 1000)
  }

  render () {
    return (
      <FooterStyle className='footer'>
        <div className="footer-image"></div>
        <p>博客已萌萌哒运行{this.convertGap(this.state.gap)}<span className="face">(●'◡'●)ﾉ♥</span></p>
        <p>托管于vps. <a href="https://qiniu.com" target="_blank" ref="nofollow">七牛云</a> 提供 CDN 服务. <a href="https://www.google.com/analytics/" target="_blank" ref="nofollow">Google Analytics</a> 提供网站统计服务.</p>
        <p>© 2018 Hi, B1anker. 抄袭于<a href="https://diygod.me/" target="_blank" ref="nofollow">Diygod</a>. Theme By <a href="https://github.com/DIYgod/hexo-theme-sagiri" target="_blank" ref="nofollow"></a>Sagiri v0.0.16.站点地图. 粤ICP备16024121号.</p>
        <p>Made with by B1anker.</p>
      </FooterStyle>
    )
  }

  convertGap (gap) {
    const day = Math.floor(gap / DAY_GAP)
    const hour = Math.floor((gap - day * DAY_GAP) / HOUR_GAP)
    const minute = Math.floor((gap - day * DAY_GAP - hour * HOUR_GAP) / MINUTE_GAP)
    const second = Math.floor((gap - day * DAY_GAP - hour * HOUR_GAP - minute * MINUTE_GAP) / SECOND_GAP)
    return `${day}天${hour}小时${minute}分${second}秒`
  }
}