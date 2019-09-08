import { SecretModel } from '@/models/secrets'
import { Form, Input } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { ColumnProps } from 'antd/lib/table'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const FormItem = Form.Item
export const EditableContext = React.createContext({})

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

export const EditableFormRow = Form.create()(EditableRow)

export interface EditableCellProps extends ColumnProps<SecretModel> {
  handleSave: (row) => void
  editable?: boolean
  record: any
}

let form: WrappedFormUtils

const EditableCell = (props: EditableCellProps) => {
  const { editable, dataIndex, title, record, handleSave, children, ...restProps } = props
  const [editing, setEditing] = useState(false)
  const cell: React.RefObject<HTMLTableDataCellElement> = useRef(null)
  const input: React.RefObject<Input> = useRef(null)

  const save = () => {
    const { record, handleSave } = props
    form.validateFields(async (error, values) => {
      if (error) {
        return
      }
      await handleSave({ ...record, ...values })
      toggleEdit()
    })
  }

  const toggleEdit = () => {
    setEditing((prevEditing) => {
      return !prevEditing
    })
  }

  const handleClickOutside = useCallback(
    (e) => {
      if (
        editing &&
        cell.current &&
        cell.current !== e.target &&
        !cell.current.contains(e.target)
      ) {
        toggleEdit()
      }
    },
    [editing]
  )

  useEffect(() => {
    if (editing && input.current) {
      input.current.focus()
    }
  }, [editing])

  useEffect(() => {
    if (editable) {
      document.addEventListener('click', handleClickOutside, true)
    }
    return () => {
      if (editable) {
        document.removeEventListener('click', handleClickOutside, true)
      }
    }
  }, [editable, handleClickOutside])

  return (
    <td ref={cell} {...restProps}>
      {editable ? (
        <EditableContext.Consumer>
          {(innerForm: WrappedFormUtils) => {
            form = innerForm
            return editing && dataIndex ? (
              <FormItem style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                  rules: [
                    {
                      required: true,
                      message: `请填写${title}`
                    }
                  ],
                  initialValue: record[dataIndex]
                })(
                  <Input ref={input} onPressEnter={save} />
                )}
              </FormItem>
            ) : (
              <div
                className="editable-cell-value-wrap"
                onClick={toggleEdit}
              >
                {children}
              </div>
            )
          }}
        </EditableContext.Consumer>
      ) : (
        children
      )}
    </td>
  )
}

export default EditableCell
