import AC from './components/AsyncComponent'

export default [
  {
    name: '首页',
    icon: 'home',
    path: '/',
    exact: true,
    component: AC(() => import('@/pages/home'))
  },
  {
    name: '登录页',
    path: '/login',
    exact: false,
    component: AC(() => import('@/pages/login'))
  },
  {
    name: '管理员页',
    icon: 'admin',
    path: '/admin',
    exact: false,
    component: AC(() => import('@/pages/admin'))
  },
  {
    name: '工具页',
    icon: 'tool',
    path: '/tools',
    exact: false,
    component: AC(() => import('@/pages/tools'))
  },
  {
    name: '首页',
    icon: 'home',
    path: '/',
    exact: false,
    component: AC(() => import('@/pages/home'))
  },
  {
    name: '404',
    icon: '404',
    path: '*',
    component: AC(() => import('@/pages/404'))
  }
]
