import { lazy } from 'react'

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
        component: lazy(() => import(/* webpackChunkName: "postEdit" */ './postEdit'))
      },
      {
        name: '编辑',
        icon: 'edit',
        path: '/admin/post/edit/:pid',
        component: lazy(() => import(/* webpackChunkName: "postEdit" */ './postEdit'))
      },
      {
        name: '列表',
        icon: 'table',
        path: '/admin/post/list',
        component: lazy(() => import(/* webpackChunkName: "list" */ './list'))
      },
      {
        name: '分类',
        icon: 'bars',
        path: '/admin/post/category',
        component: lazy(() => import(/* webpackChunkName: "category" */ './category'))
      }
    ]
  }
]
