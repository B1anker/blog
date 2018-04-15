import Model from '@/core/model'

class Post extends Model {
  modelName = '/post'

  fetchPostList () {
    return this.fetch.get(`${this.modelName}/list`)
  }

  fetchPost (pid) {
    return this.fetch.get(`${this.modelName}/${pid}`)
  }

  addPost (data) {
    return this.fetch.post(`${this.modelName}/add`, data)
  }
}

export default new Post()