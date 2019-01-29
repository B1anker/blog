import { Button } from 'antd'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { NotFoundStyle } from './style'

export default class NotFound extends Component<RouteComponentProps> {
  public render () {
    return (
      <NotFoundStyle>
        <div className="image" />
        <div className="content">
          <div className="title">404</div>
          <div className="tip">抱歉，你访问的页面不存在</div>
          <Button type="primary" onClick={() => {
            this.props.history.push('/')
          }}>返回首页</Button>
        </div>
      </NotFoundStyle>
    )
  }
}
