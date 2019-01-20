import Model from '@/core/model';

class Post extends Model {
  modelName = '/post'

  fetchPostList () {
    return this.http.get(`${this.modelName}/list`)
  }

  fetchPost (pid) {
    return this.http.get(`${this.modelName}/${pid}`)
  }

  addPost (data) {
    return this.http.post(`${this.modelName}/add`, data)
  }

  updatePost (data) {
    return this.http.put(`${this.modelName}/update`, data)
  }

  delPost (id) {
    return this.http.delete(`${this.modelName}/${id}`)
  }
}

export default new Post()