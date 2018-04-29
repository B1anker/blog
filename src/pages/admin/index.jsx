import { Avatar, Col, Dropdown, Icon, Layout, Menu, Row } from 'antd'
import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import styles from './style.less'
import routes from './routes'
const { Header, Sider, Content } = Layout

export default class Login extends Component {
  constructor () {
    super()
    this.state = {
      collapsed: false,
      selectedMenu: ''
    }
    this.contentEl = null
  }

  componentDidMount () {
    this.$models.user.getInfo()
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
          <Menu theme='dark'
            mode='inline'
            defaultOpenKeys={['/admin/post']}
            selectedKeys={[this.state.selectedMenu]}
            onClick={({item, key, keyPath}) => {
              console.log(key)
              this.setState({
                selectedMenu: key.replace(/:.*/, '')
              })
              this.props.history.push(key.replace(/:.*/, ''))
            }}>
            {
              routes.map((route, index) => {
                if (route.children) {
                  return (
                    <Menu.SubMenu title={<span><Icon type={route.icon} /><span>{ route.name }</span></span>} key={route.path} >
                      {
                        route.children.map((child, i) => {
                          if (child.noRender) {
                            return ''
                          }
                          return (
                            <Menu.Item key={child.path}>
                              {/* <Icon type={ child.icon } /> */}
                              <span>{ child.name }</span>
                            </Menu.Item>
                          )
                        }
                        )
                      }
                    </Menu.SubMenu>
                  )
                }
                return (
                  <Menu.Item key={index}>
                    <Icon type={ route.icon } />
                    <span>{ route.name }</span>
                  </Menu.Item>
                )
              })
            }
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
                      <Avatar className={styles.avatar} src={require('../../assets/avatar.jpg')} />
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
              <Switch>
                {
                  routes.map(({ name, path, exact = false, component, redirect, children }) => {
                    return children.map((child) => <Route path={child.path} exact={child.exact} component={child.component} key={child.name}/>).concat(redirect ? <Redirect to={redirect} key={name} /> : [])
                  })
                }
              </Switch>
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
