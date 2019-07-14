import Model from '@/core/model'
import { CategoryModel } from './category'

export interface PostModel {
  title: string
  content: string
  id?: string
  tags: string[]
  categories: CategoryModel[]
  created: number
  updated: number
  summary: string
  views: number
  key?: string
}

class Post extends Model {
  private modelName = '/post'

  public fetchPostList () {
    return this.http.get<{ msg: string; list: PostModel[] }>(`${this.modelName}`)
  }

  public fetchPost (pid) {
    return this.http.get(`${this.modelName}/${pid}`)
  }

  public addPost (data) {
    return this.http.post(`${this.modelName}`, data)
  }

  public updatePost (data) {
    return this.http.put(`${this.modelName}`, data)
  }

  public delPost (id) {
    return this.http.delete(`${this.modelName}/${id}`)
  }

  public view (id) {
    return this.http.post(`${this.modelName}/view`, {
      id
    })
  }
}

export default new Post()
