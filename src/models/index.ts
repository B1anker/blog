import { Component } from 'react'

import auth from './auth'
import post from './post'
import user from './user'

export const $models = {
  post,
  user,
  auth
}

export default () => {
  Object.defineProperty(Component.prototype, '$models', {
    get () {
      return $models
    },

    set (newVal) {
      return newVal
    }
  })
}
