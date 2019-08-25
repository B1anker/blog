import { setUserInfo } from '@/actions/user'
import store from '@/store'
import { Alert, message } from 'antd'
import JSEncrypt from 'jsencrypt'
import React from 'react'
import LoginStyle from './style'

import ExtendComponent from '@/core/component'

import LoginForm from './loginForm'

interface LoginState {
  loginState: string
}

export default class Login extends ExtendComponent<any, LoginState> {
  private encryptor: JSEncrypt

  public constructor (props) {
    super(props)
    this.state = {
      loginState: 'E0000'
    }
    this.encryptor = new JSEncrypt()
  }

  public async componentDidMount () {
    const { data } = await this.$models.auth.getPublicKey()
    this.encryptor.setPublicKey(data.data)
  }

  public render () {
    return (
      <LoginStyle className="login">
        <div className="container">
          {this.state.loginState === 'E0001' ? (
            <Alert message="账号或密码错误" type="error" showIcon={true} />
          ) : (
            ''
          )}
          <div className="form">
            <h1 className="title">RE0:&nbsp;&nbsp;博客后台管理系统</h1>
            <LoginForm
              login={(account, password, remember) =>
                this.login(account, password, remember)
              }
            />
          </div>
        </div>
      </LoginStyle>
    )
  }

  private async login (account: string, password: string, remember?: boolean) {
    const localAccount: string | null = localStorage.getItem('account')
    const localPassword: string | null = localStorage.getItem('password')
    let submitAccout: string
    let submitPassword: string
    if (remember && localAccount && localPassword) {
      submitAccout = localAccount
      submitPassword = localPassword
    } else {
      submitAccout = account
      submitPassword = this.encryptor.encrypt(password)
    }
    try {
      const { data } = await this.$models.auth.login({
        account: submitAccout,
        password: submitPassword
      })
      message.success('登录成功')
      store.dispatch(setUserInfo(data.data))
      this.props.history.push('/admin/post')
    } catch (err) {
      message.error('登录失败')
    }
  }
}
