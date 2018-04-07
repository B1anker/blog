import { Button, Checkbox, Form, Icon, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import React, { Component } from 'react'
const FormItem = Form.Item
import style from './style.less'

class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pending: false
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={(e) => {
        this.handleSubmit(e)
      }}>
        <FormItem hasFeedback={true}>
          {
            getFieldDecorator('username', {
              rules: [{
                required: true, message: '请输入用户名!'
              }, {
                validator: this.checkUsername
              }],
              validateTrigger: ['onBlur', 'onChange']
            })(
              <Input prefix={
                  <Icon type='user'
                    style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                size='large'
                placeholder='Username' />
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
                <Icon type='lock'
                  style={{ color: 'rgba(0,0,0,.25)' }} />}
                type='password'
                size='large'
                placeholder='Password' />
            )
          }
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>Remember me</Checkbox>
            )}
            <Button type='primary'
              htmlType='submit'
              className={style.submit}
              loading={this.state.pending}>
              Log in
            </Button>
        </FormItem>
      </Form>
    )
  }

  checkUsername (rule, value, callback) {
    if (!value) {
      callback()
    } else if (!~value.search(/^[a-zA-Z0-9_-]{4,16}$/)) {
      callback('用户名为4到16位（字母，数字，下划线，减号）')
    } else {
      callback()
    }
  }

  handleSubmit (e) {
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
          await this.props.callback(values.username, values.password, values.remember)
        } catch (err) {
          console.log(err)
        } finally {
          this.setState({
            pending: false
          })
        }
      }
    })
  }
}

export default Form.create()(LoginForm)
