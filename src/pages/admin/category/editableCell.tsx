import { CategoryModel } from '@/models/category'
import { Form, Icon, Input } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import React from 'react'

import ExtendComponent from '@/core/component'
import { EditableInputStyle } from './style'

const FormItem = Form.Item
const EditableContext = React.createContext({})

export const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

export interface EditableCellProps extends ColumnProps<CategoryModel> {
  handleSave: (row) => void
  editable?: boolean
  record: any
}

interface EditableCellState {
  editing: boolean
}

export default class EditableCell extends ExtendComponent<
  EditableCellProps,
  EditableCellState
> {
  private cell: React.RefObject<HTMLTableDataCellElement> = React.createRef()
  private input: React.RefObject<Input> = React.createRef()
  private form: any

  public constructor (props) {
    super(props)
    this.state = {
      editing: false
    }
  }

  public componentDidMount () {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true)
    }
  }

  public render () {
    const { editing } = this.state
    const {
      editable,
      dataIndex,
      title,
      record,
      handleSave,
      ...restProps
    } = this.props
    return (
      <td ref={this.cell} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form: any) => {
              this.form = form
              return editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `请填写${title}`
                      }
                    ],
                    initialValue: dataIndex && record[dataIndex]
                  })(
                    <EditableInputStyle className="input-wrap">
                      <Input
                        ref={this.input}
                        onPressEnter={this.save}
                      />
                      <Icon type="check-circle"
                        className="check"
                        theme="filled"
                        style={{
                          color: '#52c41a'
                        }}
                        onClick={() => this.save()}
                      />
                      {/* <Icon type="close-circle"
                        className="close"
                        theme="filled"
                        style={{
                          color: '#f5222d'
                        }}
                      /> */}
                    </EditableInputStyle>
                  )}
                </FormItem>
              ) : (
                <div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 24 }}
                  onClick={this.toggleEdit}
                >
                  {restProps.children}
                </div>
              )
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    )
  }

  private toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing && this.input.current) {
        this.input.current.focus()
      }
    })
  }

  private handleClickOutside = (e) => {
    const { editing } = this.state
    if (editing && this.cell !== e.target && this.cell.current && !this.cell.current.contains(e.target)) {
      this.toggleEdit()
    }
  }

  private save = () => {
    const { record, handleSave } = this.props
    this.form.validateFields(async (error, values) => {
      if (error) {
        return
      }
      await handleSave({ ...record, ...values })
      this.toggleEdit()
    })
  }
}
