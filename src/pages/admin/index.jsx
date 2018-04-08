import { Avatar, Col, Dropdown, Icon, Layout, Menu, Row } from 'antd'
import React, { Component } from 'react'
import MarkDown from '../../components/admin/markdown'
import api from '../../http/api'
import styles from './style.less'
const { Header, Sider, Content } = Layout

export default class Login extends Component {
  constructor () {
    super()
    this.state = {
      collapsed: false
    }
    this.contentEl = null
  }

  componentDidMount () {
    React.$http.get(api.user.info).then((res) => {
      console.log(res)
    })
    setTimeout(() => {
      this.contentEl.style.height = this.contentEl.parentNode.getBoundingClientRect().height - 2 * 24 + 'px'
    })
  }

  render () {
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.props.onMenuClick}>
        <Menu.Item disabled={true}><Icon type='user' />个人中心</Menu.Item>
        <Menu.Item disabled={true}><Icon type='setting' />设置</Menu.Item>
        <Menu.Item key='triggerError'><Icon type='close-circle' />触发报错</Menu.Item>
        <Menu.Divider />
        <Menu.Item key='logout'><Icon type='logout' />退出登录</Menu.Item>
      </Menu>
    )
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={this.state.collapsed}
        >
          <div className={styles.logo} />
          <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
            <Menu.Item key='1'>
              <Icon type='user' />
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key='2'>
              <Icon type='video-camera' />
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key='3'>
              <Icon type='upload' />
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header className={styles.header}>
            <Row type='flex' justify='space-between' align='middle'>
              <Col span={1}>
                <Icon
                  className={styles.trigger}
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={() => {
                    this.toggle()
                  }}
                />
              </Col>
              <Col span={4}>
                <Row type='flex' justify='end' align='middle'>
                  <Dropdown overlay={menu}>
                    <span className={`${styles.action} ${styles.account}`}>
                      <Avatar className={styles.avatar} src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
                      <span className={styles.name}>b1anker</span>
                    </span>
                  </Dropdown>
                </Row>
              </Col>
            </Row>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <div className="content"
              ref={(el) => {
                this.contentEl = el
              }}>
              <MarkDown />
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }

  toggle () {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
}
