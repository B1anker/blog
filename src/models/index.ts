import { Component } from 'react'

import auth from './auth'
import category from './category'
import post from './post'
import user from './user'

export const $models = {
  post,
  user,
  auth,
  category
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
