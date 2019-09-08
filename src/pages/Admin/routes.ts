import { ComponentType, lazy, LazyExoticComponent } from 'react'

interface Route {
  name: string
  icon?: string
  component?: LazyExoticComponent<ComponentType<any>>
  path: string
  redirect?: string
  noRender?: boolean
  exact?: boolean
  children?: Route[]
}

const routes: Route[] = [
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
        component: lazy(() => import(/* webpackChunkName: "postEdit" */ './PostEdit'))
      },
      {
        name: '编辑',
        icon: 'edit',
        path: '/admin/post/edit/:pid',
        component: lazy(() => import(/* webpackChunkName: "postEdit" */ './PostEdit'))
      },
      {
        name: '列表',
        icon: 'table',
        path: '/admin/post/list',
        component: lazy(() => import(/* webpackChunkName: "list" */ './List'))
      },
      {
        name: '分类',
        icon: 'bars',
        path: '/admin/post/category',
        component: lazy(() => import(/* webpackChunkName: "category" */ './Category'))
      }
    ]
  },
  {
    name: '系统管理',
    icon: 'setting',
    path: '/admin/system',
    redirect: '/admin/system/secrets',
    children: [
      {
        name: '秘钥管理',
        path: '/admin/system/secrets',
        exact: true,
        component: lazy(() => import(/* webpackChunkName: "secrets" */ './System/Secrets'))
      }
    ]
  }
]

export default routes
