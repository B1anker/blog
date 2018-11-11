import { Alert, message } from 'antd'
import React, { Component } from 'react'
import LoginForm from './login-form'
import style from './style.less'

export default class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loginState: 'E0000'
    }
  }

  render () {
    return (
      <div className={style.login}>
        {
          this.state.loginState === 'E0001' ?
          <Alert message='账号或密码错误' type='error' showIcon={true} /> : ''
        }
        <div className={style.form}>
          <LoginForm callback={(username, password, remember) => {
            return this.login(username, password, remember)
          }}/>
        </div>
      </div>
    )
  }

  login (username, password, remember) {
    return new Promise ((resolve, reject) => {
      this.$models.user.login({
        username,
        password
      }).then((res) => {
        resolve()
        this.setState({
          loginState: 'E0000'
        })
        message.success('登录成功，正在跳转...')
        setTimeout(() => {
          this.props.history.push('/admin/post/edit')
        }, 1000)
      }).catch((err) => {
        if (err.response.data.name === 'PASSPORT_INCORRECT') {
          reject(new Error(err.response.data.name))
          this.setState({
            loginState: 'E0001'
          })
        }
      })
    })
  }
}
