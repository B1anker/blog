import ExtendComponent from '@/core/component'
import React from 'react'
import { Button, Popconfirm, Table, Tag } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { OperateButtons } from './style'
import moment from 'moment'

interface ListItem {
  _id: number
  tags: string[]
  meta: {
    createdAt: string
    updatedAt: string
  }
}

interface Column extends ListItem {
  createdAt: number
  updatedAt: number
}

interface ListState {
  dataSource: any[]
  loading: boolean
}

export default class List extends ExtendComponent<{}, ListState> {
  private columns: Array<ColumnProps<Column>>
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      loading: false
    }
    this.columns = [{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    }, {
      title: '分类',
      dataIndex: 'categories',
      key: 'categories',
      align: 'center'
    }, {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      align: 'center',
      render: (text, record) => {
        return (
          <span>{ record.tags.length ? record.tags.map((tag) => (<Tag>{ tag }</Tag>)) : '-' }</span>
        )
      }
    }, {
      title: '创建时间',
      align: 'center',
      width: 170,
      render: (text, record) => {
        return (
          <span>{ moment(record.meta.createdAt).format('YYYY-MM-DD HH:mm:ss') }</span>
        )
      }
    }, {
      title: '更新时间',
      align: 'center',
      width: 170,
      render: (text, record) => {
        return (
          <span>{ moment(record.meta.updatedAt).format('YYYY-MM-DD HH:mm:ss') }</span>
        )
      }
    }, {
      title: '操作',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return (
          <OperateButtons>
            <Button type='primary'
              size='small'
              onClick={() => {
                this.props.history.push(`/admin/post/edit/${record._id}`)
              }}>
              编辑
            </Button>
            <Popconfirm title="确认删除吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                this.handleDelete(record)
              }}>
              <Button type='danger' size='small'>
                删除
              </Button>
            </Popconfirm>
          </OperateButtons>
        )
      }
    }]
  }

  componentDidMount () {
    this.fetchList()
  }


  public render () {
    return (
      <div>
        <Table dataSource={this.state.dataSource}
          columns={this.columns}
          loading={this.state.loading} />
      </div>
    )
  }

  async fetchList () {
    this.setState({
      loading: true
    })
    const { data } = await this.$models.post.fetchPostList()
    data.forEach((d) => {
      d.key = d._id
    })
    this.setState({
      dataSource: data
    })
    this.setState({
      loading: false
    })
  }

  async handleDelete (record) {
    await this.$models.post.delPost(record._id)
    this.fetchList()
  }
}