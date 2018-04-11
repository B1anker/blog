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
    name: '登录页',
    path: '/login',
    component: AC(() => import('./pages/login'))
  },
  {
    name: '管理员页',
    path: '/admin',
    component: AC(() => import('./pages/admin'))
  }
]
