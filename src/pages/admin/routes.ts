import AC from '@/components/AsyncComponent'

export default [
  {
    name: '文章管理',
    icon: 'file-markdown',
    path: '/admin/post',
    redirect: '/admin/post/edit',
    children: [
      {
        name: '编辑',
        path: '/admin/post/edit',
        noRender: true,
        exact: true,
        component: AC(() => import('@/pages/admin/postEdit'))
      },
      {
        name: '编辑',
        icon: 'edit',
        path: '/admin/post/edit/:pid',
        component: AC(() => import('@/pages/admin/postEdit'))
      },
      {
        name: '列表',
        icon: 'table',
        path: '/admin/post/list',
        component: AC(() => import('./list'))
      },
      {
        name: '分类',
        icon: 'bars',
        path: '/admin/post/category',
        component: AC(() => import('./category'))
      }
    ]
  }
]