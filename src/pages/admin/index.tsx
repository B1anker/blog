import ExtendComponent from '@/core/component'
import { Avatar, Col, Dropdown, Icon, Layout, Menu, Row } from 'antd'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Redirect, Route, Switch } from 'react-router-dom'
import routes from './routes'
import styles from './style.less'
const { Header, Sider, Content } = Layout

interface Params {
  pid: string
}

type AdminProps = RouteComponentProps<Params>

interface AdminState {
  collapsed: boolean
}

export default class Admin extends ExtendComponent<AdminProps, AdminState> {
  private contentEl: HTMLDivElement | null
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false
    }
    this.contentEl = null
  }

  get selectedKey () {
    return (
      '/' +
      this.props.location.pathname
        .split('/')
        .slice(1, 4)
        .join('/')
    )
  }

  public componentDidMount () {
    setTimeout(() => {
      if (this.contentEl && this.contentEl.parentElement) {
        this.contentEl.style.height =
          this.contentEl.parentElement.getBoundingClientRect().height -
          2 * 24 +
          'px'
      }
    })
  }

  public render () {
    const menu = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
      >
        <Menu.Item disabled={true}>
          <Icon type="user" />
          个人中心
        </Menu.Item>
        <Menu.Item disabled={true}>
          <Icon type="setting" />
          设置
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          触发报错
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    )
    return (
      <Layout className={styles.layout}>
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={this.state.collapsed}
        >
          <div className={styles.logo} />
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={['/admin/post']}
            selectedKeys={[this.selectedKey]}
            onClick={({ key }) => {
              this.props.history.push(key.replace(/:.*/, ''))
            }}
          >
            {routes.map((route, index) => {
              if (route.children) {
                return (
                  <Menu.SubMenu
                    title={
                      <span>
                        <Icon type={route.icon} />
                        <span>{route.name}</span>
                      </span>
                    }
                    key={route.path}
                  >
                    {route.children.map((child) => {
                      if (child.noRender) {
                        return null
                      }
                      return (
                        <Menu.Item key={child.path.replace(/\/:.*/, '')}>
                          {<Icon type={child.icon} />}
                          <span>{child.name}</span>
                        </Menu.Item>
                      )
                    })}
                  </Menu.SubMenu>
                )
              }
              return (
                <Menu.Item key={index}>
                  <Icon type={route.icon} />
                  <span>{route.name}</span>
                </Menu.Item>
              )
            })}
          </Menu>
        </Sider>
        <Layout>
          <Header className={styles.header}>
            <Row type="flex" justify="space-between" align="middle">
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
                <Row type="flex" justify="end" align="middle">
                  <Dropdown overlay={menu}>
                    <span className={`${styles.action} ${styles.account}`}>
                      <Avatar
                        className={styles.avatar}
                        src={require('../../assets/avatar.jpg')}
                      />
                      <span className={styles.name}>b1anker</span>
                    </span>
                  </Dropdown>
                </Row>
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280
            }}
          >
            <div
              className={'content ' + styles.content}
              ref={(el) => {
                this.contentEl = el
              }}
            >
              <Switch>
                {routes.map((route) => {
                  const { children, redirect, path } = route
                  if (this.props.location.pathname === path && redirect) {
                    return <Redirect to={redirect}
                      key={path} />
                  }
                  return children.map((child) => (
                    <Route
                      path={child.path}
                      exact={child.exact}
                      component={child.component}
                      key={child.name}
                    />
                  ))
                })}
              </Switch>
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }

  public toggle () {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
}
