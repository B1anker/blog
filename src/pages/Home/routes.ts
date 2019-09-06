import { lazy } from 'react'

export default [
  {
    name: '文章页',
    icon: 'home',
    path: '/post/:pid',
    exact: false,
    component: lazy(() => import(/* webpackChunkName: "article" */ '@/pages/Home/Article'))
  },
  {
    name: '关于',
    icon: 'about',
    path: '/about',
    exact: false,
    component: lazy(() => import(/* webpackChunkName: "about" */ '@/pages/Home/About'))
  },
  {
    name: '归档',
    icon: 'archives',
    path: '/archives',
    exact: false,
    component: lazy(() => import(/* webpackChunkName: "archives" */ '@/pages/Home/Archives'))
  },
  {
    name: '留言板',
    icon: 'message',
    path: '/message',
    exact: false,
    component: lazy(() => import(/* webpackChunkName: "message" */ '@/pages/Home/Message'))
  }
]
