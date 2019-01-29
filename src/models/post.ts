import Model from '@/core/model'

export interface PostModel {
  title: string
  content: string
  id?: string
  tags: string[]
  categories: number[]
  summary: string
}

class Post extends Model {
  private modelName = '/post'

  public fetchPostList<T> () {
    return this.http.get<{ msg: string; list: T[] }>(`${this.modelName}`)
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
}

export default new Post()
