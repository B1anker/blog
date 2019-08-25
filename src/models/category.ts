import Model from '@/core/model'

export interface CategoryModel {
  name: string
  id?: number
  key?: string | number
  created: number
  updated: number
}

class Category extends Model {
  private modelName = '/category'

  public getList () {
    return this.http.get<{ msg: string; list: CategoryModel[] }>(
      `${this.modelName}`
    )
  }

  public get (cid: number) {
    return this.http.get(`${this.modelName}/${cid}`)
  }

  public add (data) {
    return this.http.post(`${this.modelName}`, data)
  }

  public update (data) {
    return this.http.put(`${this.modelName}`, data)
  }

  public del (cid: number) {
    return this.http.delete(`${this.modelName}/${cid}`)
  }
}

export default new Category()
