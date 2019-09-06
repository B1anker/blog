import Toolbar, { MenuItem } from '@/components/Toolbar'
import ExtendComponent from '@/core/component'
import { CategoryModel } from '@/models/category'
import { Button, Form, message, Popconfirm, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import defaultsDeep from 'lodash/defaultsDeep'
import moment from 'moment'
import React from 'react'
import EditableCell, { EditableRow } from './EditableCell'
import { CategoryStyle } from './style'

const defaultMenu: MenuItem[] = [
  {
    type: 'input',
    key: 'title',
    name: '名称',
    width: 300
  }
]

const EditableFormRow = Form.create()(EditableRow)

interface CategoryState {
  menu: MenuItem[]
  toolbar: any
  count: number
  dataSource: CategoryModel[]
  loading: boolean
}

export default class Category extends ExtendComponent<any, CategoryState> {
  private columns: Array<ColumnProps<CategoryModel> & {editable?: boolean}>
  private originDataSource: CategoryModel[] = []

  public constructor (props) {
    super(props)
    const menu = defaultsDeep([], defaultMenu)
    this.state = {
      toolbar: this.setInitialToolbarOfState(menu),
      menu,
      count: 0,
      dataSource: [],
      loading: true
    }
    this.columns = [{
      title: 'id',
      dataIndex: 'id',
      width: 120,
      align: 'center'
    }, {
      title: '名字',
      dataIndex: 'name',
      editable: true,
      align: 'center'
    }, {
      title: '创建时间',
      dataIndex: 'created',
      align: 'center',
      width: 240,
      render: (text) => {
        if (!text) {
          return '-'
        }
        return (
          <span>{ moment.unix(text).format('YYYY-MM-DD HH:mm:ss') }</span>
        )
      }
    }, {
      title: '修改时间',
      dataIndex: 'updated',
      align: 'center',
      width: 240,
      render: (text) => {
        if (!text) {
          return '-'
        }
        return (
          <span>{ moment.unix(text).format('YYYY-MM-DD HH:mm:ss') }</span>
        )
      }
    }, {
      title: '操作',
      align: 'center',
      dataIndex: 'operation',
      width: 100,
      render: (text, record) => (
        this.state.dataSource.length >= 1
          ? (
            <Popconfirm title="确认要删除?"
              onConfirm={() => this.handleDelete(Number(record.key))}
              cancelText="取消"
              okText="确认">
              <Button type="danger" size="small">删除</Button>
            </Popconfirm>
          ) : null
      ),
    }]
  }

  public componentDidMount () {
    this.getCategoryList()
  }

  public render () {
    const { dataSource, loading } = this.state
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: (row) => this.handleSave(row)
        })
      }
    })
    return (
      <CategoryStyle>
        <Toolbar
          menu={this.state.menu}
          onChange={(key: string, value) =>
            this.handleToolbarChange(key, value)
          }
          toolbar={this.state.toolbar}
          append={
            <Button type="primary"
              onClick={() => this.handleAdd()}>
              添加
            </Button>
          }
        />
        <Table className="table"
          loading={loading}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered={true}
          dataSource={dataSource}
          columns={columns}
        />
      </CategoryStyle>
    )
  }

  private async getCategoryList () {
    this.setState({
      loading: true
    })
    const { data } = await this.$models.category.getList()
    this.originDataSource = data.list.map((l) => {
      l.key = l.id
      return l
    })
    this.setState({
      dataSource: defaultsDeep([], this.originDataSource),
      count: data.list.length,
      loading: false
    })
  }

  private async handleDelete (cid: number) {
    try {
      await this.$models.category.del(cid)
      message.success('删除成功')
    } catch (err) {
      message.error('删除失败')
    }
    this.getCategoryList()
  }

  private handleAdd () {
    const { count, dataSource } = this.state
    const newData = {
      key: count + 1,
      name: '123',
      created: 0,
      updated: 0,
      id: -1
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    })
  }

  private async handleSave (row) {
    if (row.id === -1 || !row.id) {
      await this.$models.category.add({
        name: row.name
      })
      message.success('创建成功')
    } else {
      await this.$models.category.update({
        id: row.id,
        name: row.name
      })
      message.success('更新成功')
    }
    this.getCategoryList()
  }

  private setInitialToolbarOfState (menu: MenuItem[]) {
    const map: any = {}
    menu.forEach((menuItem) => {
      map[menuItem.key] = menuItem.defaultValue
    })
    return map
  }

  private handleToolbarChange (key: string, value) {
    this.setState({
      toolbar: {
        ...this.state.toolbar,
        [key]: value
      },
      dataSource: this.originDataSource.filter(({ name }) => name.includes(value))
    })
  }
}
