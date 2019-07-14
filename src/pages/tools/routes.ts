import { lazy } from 'react'

export default [
  {
    name: '表情页',
    icon: 'face',
    path: '/tools/face',
    exact: true,
    component: lazy(() => import(/* webpackChunkName: "face" */ './face'))
  }
]
