import ExtendComponent from '@/core/component'
import { Button, Checkbox, Form, Icon, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import React from 'react'

import style from './style.less'

const FormItem = Form.Item
export interface LoginFormProps extends FormComponentProps {
  login: (account: string, password: string, remember?: boolean) => void
}

interface LoginFormState {
  pending: boolean
}

export class LoginForm extends ExtendComponent<LoginFormProps, LoginFormState> {
  constructor (props) {
    super(props)
    this.state = {
      pending: false
    }
  }

  public render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={(e) => {
        this.handleSubmit(e)
      }}>
        <FormItem hasFeedback={true}>
          {
            getFieldDecorator('account', {
              rules: [{
                required: true, message: '请输入用户名!'
              }, {
                validator: this.checkaccount
              }],
              validateTrigger: ['onBlur', 'onChange']
            })(
              <Input prefix={
                  <Icon type="user"
                    style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                size="large"
                placeholder="请输入账号" />
            )
          }
        </FormItem>
        <FormItem hasFeedback={true}>
          {
            getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码！' }],
              validateTrigger: ['onBlur', 'onChange']
            })(
              <Input prefix={
                <Icon type="lock"
                  style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                size="large"
                placeholder="请输入密码" />
            )
          }
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>记住登录</Checkbox>
            )}
            <Button type="primary"
              htmlType="submit"
              className={style.submit}
              loading={this.state.pending}>
              Log in
            </Button>
        </FormItem>
      </Form>
    )
  }

  public checkaccount (rule, value, callback) {
    if (!value) {
      callback()
    } else if (!~value.search(/^[a-zA-Z0-9_-]{4,16}$/)) {
      callback('用户名为4到16位（字母，数字，下划线，减号）')
    } else {
      callback()
    }
  }

  public handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (this.state.pending) {
          return
        }
        this.setState({
          pending: true
        })
        try {
          await this.props.login(values.account, values.password, values.remember)
          if (!this.unmount) {
            this.setState({
              pending: false
            })
          }
        } catch (err) {
          console.log(err)
        }
      }
    })
  }
}

export default Form.create<LoginFormProps>()(LoginForm)
