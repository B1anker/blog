import ExtendComponent from '@/core/component'
import { Input, Select } from 'antd'
import React from 'react'
import { ToolbarStyle } from './style'

const InputGroup = Input.Group
const Option = Select.Option

export interface OptionItem {
  label: string
  value: string | number
  disabled?: boolean
}

export interface MenuItem {
  type: 'input' | 'select'
  defaultValue?: string | number | null | string[] | number[]
  optionList?: OptionItem[]
  placeholder?: string
  mode?: 'default' | 'multiple' | 'tags' | 'combobox' | string
  name: string
  key: string
  width?: number
  disabled?: boolean
  addonAfter?: React.ReactNode
  group?: boolean
}

export interface ToolbarProps {
  menu: MenuItem[]
  onChange: (key: string, value: any) => void
  toolbar: {[T in any]: any}
  append?: React.ReactNode
  prepend?: React.ReactNode
}

export default class Toolbar extends ExtendComponent<ToolbarProps, {}> {
  public constructor (props: ToolbarProps) {
    super(props)
  }

  public render () {
    return (
      <ToolbarStyle>
        <div className="tool-bar">
          <div className="main">
            {
              this.props.menu.map((menuItem) => {
                const { name, key } = menuItem
                return (
                  <div className="tool-bar-item"
                    key={ key }>
                    <div className="tool-bar-label">
                      <label htmlFor="">{ name }</label>
                    </div>
                    <div className="tool-bar-body">
                      { this.generateToolbarBody(menuItem) }
                    </div>
                  </div>
                )
              })
            }
            <div className="prepend">
              { this.props.prepend }
            </div>
          </div>
          <div className="append">
            { this.props.append }
          </div>
        </div>
      </ToolbarStyle>
    )
  }

  private generateToolbarBody (menuItem: MenuItem) {
    const { type, optionList, key, disabled, width, name, addonAfter, group } = menuItem
    let { placeholder } = menuItem
    const { mode } = menuItem
    placeholder = placeholder || `请${ type === 'input' ? '输入' : '选择' }${name}`
    if (type === 'input') {
      if (group) {
        return (
          <InputGroup>
            <Input placeholder={placeholder}
              style={{
                width: `${width || 240}px`
              }}
              value={this.props.toolbar[key]}
              disabled={disabled}
              onChange={(e) => this.handleMenuItemChange(key, e.target.value)}
            />
            { addonAfter }
          </InputGroup>
        )
      }
      return (
        <Input placeholder={placeholder}
          style={{
            width: `${width || 240}px`
          }}
          value={this.props.toolbar[key]}
          disabled={disabled}
          addonAfter={addonAfter}
          onChange={(e) => this.handleMenuItemChange(key, e.target.value)}
        />
      )
    } else if (type === 'select') {
      return (
        <Select
          style={{
            width: `${width || 240}px`
          }}
          mode={ mode }
          value={this.props.toolbar[key]}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(value) => this.handleMenuItemChange(key, value)}>
          {
            optionList ? optionList.map(({ label, value, disabled }) => {
              return (
                <Option value={value}
                  disabled={disabled}
                  key={key}>
                  { label }
                </Option>
              )
            }) : null
          }
        </Select>
      )
    }
    return null
  }

  private handleMenuItemChange (key: string, value) {
    this.props.onChange(key, value)
  }
}
