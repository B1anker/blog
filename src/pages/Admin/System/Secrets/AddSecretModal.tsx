import secretsApi from '@/models/secrets'
import { Form, Input, message, Modal } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import React, { useState } from 'react'

interface AddSecretModalProps {
  visible: boolean
  mode: 'add' | 'edit'
  handleCancel: () => void
  handleOk: () => void
  form: WrappedFormUtils
}

const FormItem = Form.Item

const AddSecretModal = (props: AddSecretModalProps) => {
  const [confirmLoading, setconfirmLoading] = useState(false)
  const { getFieldDecorator } = props.form
  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  }

  const handleCancel = () => {
    props.form.resetFields()
    props.handleCancel()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        throw err
      } else {
        console.log('Received values of form: ', values)
        setconfirmLoading(true)
        try {
          await secretsApi.createSecret(values)
          message.success('添加秘钥成功')
          props.form.resetFields()
          props.handleOk()
        } catch (err) {
          message.error('添加秘钥失败')
        } finally {
          setconfirmLoading(false)
        }
      }
    })
  }

  return (
    <Modal
      visible={props.visible}
      cancelText="取消"
      okText="确认"
      title={props.mode === 'add' ? '新增秘钥' : '编辑秘钥'}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form {...formItemLayout}>
        <FormItem label="键">
          {getFieldDecorator('key', {
            rules: [
              {
                required: true,
                message: '请输入键'
              }
            ]
          })(<Input placeholder="请输入键" />)}
        </FormItem>
        <FormItem label="值">
          {getFieldDecorator('value', {
            rules: [
              {
                required: true,
                message: '请输入值'
              }
            ]
          })(<Input placeholder="请输入值" />)}
        </FormItem>
        <FormItem label="描述">
          {getFieldDecorator('desc')(<Input placeholder="请输入描述" />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

const WrappedAddSecretModal = Form.create<AddSecretModalProps>({
  name: 'addSecret'
})(AddSecretModal)
export default WrappedAddSecretModal
