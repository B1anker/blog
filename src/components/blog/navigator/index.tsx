import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, MenuItem, Navigator } from './style'

interface NavProps {
  system: {
    scrolled: boolean
  }
}

interface NavItem {
  name: string
  route: string
  icon: string
}

interface NavState {
  navList: NavItem[]
}

class Nav extends Component<NavProps, NavState> {
  constructor (props) {
    super(props)
    this.state = {
      navList: [{
        name: 'home',
        route: '/',
        icon: 'home'
      }, {
        name: 'archives',
        route: '/archives',
        icon: 'archive'
      }, {
        name: '投喂',
        route: '/donate',
        icon: 'cutlery'
      }, {
        name: '留言板',
        route: '/comment',
        icon: 'pencil'
      }, {
        name: 'about',
        route: '/about',
        icon: 'rocket'
      }]
    }
  }

  get scrolled () {
    return this.props.system.scrolled
  }

  render () {
    return (
      <Navigator className={this.scrolled ? 'site-nav active' : 'site-nav'}>
        <Menu id='menu' className='menu'>
          {
            this.state.navList.map((nav, index) => (
              <MenuItem className={ `menu-item menu-item-${nav.name}` } key={ index }>
                <Link to={ nav.route }>
                  <i className={ `menu-item-icon iconfont icon-${nav.icon}` } />
                  <span>{ nav.name }</span>
                </Link>
              </MenuItem>
            ))
          }
        </Menu>
      </Navigator>
    )
  }
}

const mapStateToProps = (state) => ({
  system: state.system
})

export default connect<NavProps>(
  mapStateToProps
)(Nav)
