import AC from '@/components/AsyncComponent'

export default [
  {
    name: '文章页',
    icon: 'home',
    path: '/post/:pid',
    exact: false,
    component: AC(() => import('@/pages/home/article'))
  },
  {
    name: '关于',
    icon: 'about',
    path: '/about',
    exact: false,
    component: AC(() => import('@/pages/home/about'))
  }
]
