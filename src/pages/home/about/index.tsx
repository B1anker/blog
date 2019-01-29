import { Icon, Timeline } from 'antd'
import React, { Component } from 'react'
import AboutStyle from './style'

const ClockIcon = <Icon type="clock-circle-o" style={{ fontSize: '16px' }} />

export default class About extends Component {
  public render () {
    return (
      <AboutStyle className="about">
        <Timeline>
          <Timeline.Item>
            <h3 className="expirence">
              <img className="logo" src="https://a.msstatic.com/huya/main/img/logo.png" alt=""/>虎牙信息科技 (2017年10月 - 至今)
            </h3>
            <h3>前端开发工程师 基础保障部</h3>
            <Timeline>
              <Timeline.Item dot={ClockIcon}>
                <h4>一、前端监控系统</h4>
                <p>1.该系统的技术选型，代码框架搭建等，基本上都是自己从零到一去研究探索的;</p>
                <p>2.对需求进行整理，把前端监控系统主要分为三个大模块:性能监控，错误监控，自定义监控，sdk版本管理;</p>
                <p>3.技术调研:使用了React，antd，echarts，typescript作为前端的主要技术栈，egg，mysql作为后端的主要技术栈，性能数
    据上报到opentsdb，错误数据上报到数据中心等;</p>
                <p>4.前端开发:完成项目管理，性能监控，页面监控，资源加载，自定义监控，指标查询，系统设置等页面;</p>
                <p>5.后端开发:完成项目CRUD，性能数据统计，接口转发，中间件开发，接入数据库，sdk管理等模块;</p>
              </Timeline.Item>
              <Timeline.Item color="green">
                <h4>二、skynet监控服务系统</h4>
                <p>1.基于vue.js，echarts开发的多页面，主要用于监控服务器的各种数据(流量，延时，丢包率，CPU负载等)，并拉取数据展示
    成所需图表，通过设置条件以进行报警，运维，开发人员可以根据此系统快速定位问题并予以解决，从而提高服务器稳定性;</p>
                <p>2.抽离零碎的报表页面/表单页面，只需编写相关配置就可以生成报表/表单，提高开发效率;</p>
                <p>3.做了页面性能优化，抽取打包公共模块。利用Service Worker缓存文件以加快页面访问速度和提高代码可维护性，拦截接口做
    代理中间层，提高代码可维护性;</p>
                <p>4.做了图表类相关优化，在可视区域渲染，非可视区域清除，使页面不那么卡顿，提高用户体验;</p>
              </Timeline.Item>
              <Timeline.Item color="green">
                <h4>三、数据中心自定义报表</h4>
                <p>1.基于vue，vuex，echarts等技术栈开发该系统的前端页面;</p>
                <p>2.基于d3.js实现了一个简易版的图表库，用于自定义图表扩展;</p>
                <p>3.基于puppeteer开发截图服务，后端调用该服务可以给指定用户发送邮件展示报表;</p>
                <p>4.利用溶图算法开发出透明水印模块，以防图表泄露;</p>
              </Timeline.Item>
            </Timeline>
          </Timeline.Item>
          <Timeline.Item>
            <h3 className="expirence">
              个人项目经历
            </h3>
            <Timeline>
              <Timeline.Item dot={ClockIcon}>
                <h4>个人博客</h4>
                <p>1.基于个人兴趣，想体验从零到一开发一个前后端的系统的全过程，最终决定以个人博客为目标;</p>
                <p>2.前端使用mvvm框架React，antd作为其核心部分开发单页面，并使用了Service Worker做离线缓存，静态资源托管CDN;</p>
                <p>3.后端使用node.js，koa2，mongodb作为其核心部分，域名备案，部署服务器;</p>
                <p>4.已完成部分页面，并编写了相关文章进行分享，博客页面<a className="link" href="https://b1anker.com;">地址</a></p>
              </Timeline.Item>
              <Timeline.Item color="green">
                <h4>仿ios网易云音乐的web app</h4>
                <p>1.前端使用 Vue.js Scss，在不适用UI库的情况下，通过参照element-ui源码，设计专属组件;</p>
                <p>2.后端使用 Node.js Koa2 Mongodb 作为其核心部分;</p>
                <p>3.完成搜索功能、音乐播放、歌词展示、用户评论、好友动态、推荐歌单、歌单列表、排行榜等功能。</p>
              </Timeline.Item>
            </Timeline>
          </Timeline.Item>
        </Timeline>
      </AboutStyle>
    )
  }
}
