import AC from './components/AsyncComponent'

export default [
  {
    name: '首页',
    icon: 'home',
    path: '/',
    exact: true,
    component: AC(() => import('./pages/home'))
  },
  {
    name: '文章页',
    icon: 'home',
    path: '/post/:pid',
    exact: true,
    component: AC(() => import('./pages/post'))
  },
  {
    name: '登录页',
    path: '/login',
    component: AC(() => import('./pages/login'))
  },
  {
    name: '管理员页',
    icon: 'admin',
    path: '/admin',
    exact: false,
    component: AC(() => import('./pages/admin'))
  }
]
