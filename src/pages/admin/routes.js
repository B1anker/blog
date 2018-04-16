import AC from '@/components/AsyncComponent'

export default [
  {
    name: '编辑页',
    icon: 'edit',
    path: '/admin/edit',
    component: AC(() => import('@/components/admin/markdown'))
  }
]
