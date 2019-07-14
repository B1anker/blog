import { lazy } from 'react'

export default [
  {
    name: '首页',
    icon: 'home',
    path: '/',
    exact: true,
    component: lazy(() => import(/* webpackChunkName: "home" */ '@/pages/home'))
  },
  {
    name: '登录页',
    path: '/login',
    exact: false,
    component: lazy(() => import(/* webpackChunkName: "login" */ '@/pages/login'))
  },
  {
    name: '管理员页',
    icon: 'admin',
    path: '/admin',
    exact: false,
    component: lazy(() => import(/* webpackChunkName: "admin" */ '@/pages/admin'))
  },
  {
    name: '工具页',
    icon: 'tool',
    path: '/tools',
    exact: false,
    component: lazy(() => import(/* webpackChunkName: "tools" */ '@/pages/tools'))
  },
  {
    name: '首页',
    icon: 'home',
    path: '/',
    exact: false,
    component: lazy(() => import(/* webpackChunkName: "home" */ '@/pages/home'))
  },
  {
    name: '404',
    icon: '404',
    path: '*',
    component: lazy(() => import(/* webpackChunkName: "404" */ '@/pages/404'))
  }
]
