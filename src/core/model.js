/**
 * Created by ericeyang on Thu Nov 02 2017
 *
 * @author Erice Yang<ericeyany@gmail.com>
 * @copyright (c) 2017 huya.com
 */
import http from './http'

export default class Model {
  /**
   * @var {string} 模型名称
   */
  modelName = ''

  /**
   * 统一异步请求处理函数
   * 
   * @returns 
   * @memberof Model
   */
  fetch = http
}
