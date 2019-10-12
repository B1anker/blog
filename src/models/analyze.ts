import Model from '@/core/model'
import dayjs from 'dayjs'
import cookie from 'js-cookie'

class Analyze extends Model {
  private modelName = '/analyze'

  public async pv () {
    return this.http.get<{ message: string, data: { pv: number } }>(`${this.modelName}/pv`)
  }

  public async uv () {
    return this.http.get<{ message: string, data: { uv: number } }>(`${this.modelName}/uv`)
  }

  public async view (from: string) {
    this.updatePv(from)
    if (cookie.get('view')) {
      this.updateUv(from)
      return
    }
    const expire = dayjs(
      dayjs()
        .add(1, 'day')
        .format('YYYY-MM-DD')
    ).subtract(1, 'second').toDate()
    localStorage.view = JSON.stringify({})
    cookie.set('view', 'true', expire)
    this.updateUv(from)
  }

  private async updatePv (from: string) {
    return this.http.put<{ message: string }>(`${this.modelName}/pv`, {
      from
    })
  }

  private async updateUv (from) {
    let viewMap: any = {}
    try {
      viewMap = localStorage.view && JSON.parse(localStorage.view) || {}
    } catch (err) {
      console.log('parse view error')
    }
    if (!viewMap[from]) {
      viewMap[from] = true
      localStorage.view = JSON.stringify(viewMap)
      await this.http.put<{ message: string }>(`${this.modelName}/uv`, {
        from
      })
    }
  }
}

export default new Analyze()
