import AC from '@/components/AsyncComponent'

export default [
  {
    name: '表情页',
    icon: 'face',
    path: '/tools/face',
    exact: true,
    component: AC(() => import('./face'))
  }
]
