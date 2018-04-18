import AC from '@/components/AsyncComponent'

export default [
  {
    name: '文章管理',
    icon: 'file-markdown',
    path: '/admin/post',
    redirect: '/admin/post/edit',
    children: [{
      name: '编辑',
      icon: 'edit',
      path: '/admin/post/edit',
      component: AC(() => import('@/components/admin/markdown')),
    }]
  }
]
