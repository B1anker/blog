import ExtendComponent from '@/core/component'
import { Button, message, Popconfirm, Table, Tag } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import moment from 'moment'
import React from 'react'
import { OperateButtons } from './style'

interface ListItem {
  id: string
  key: string
  title: string
  categories: string
  tags: string[]
}

interface Column extends ListItem {
  created: number
  updated: number
}

interface ListState {
  dataSource: ListItem[]
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
    this.columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        align: 'center'
      },
      {
        title: '分类',
        dataIndex: 'categories',
        key: 'categories',
        align: 'center'
      },
      {
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
        align: 'center',
        render: (text, record) => {
          return (
            <span>
              {record.tags.length
                ? record.tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)
                : '-'}
            </span>
          )
        }
      },
      {
        title: '创建时间',
        align: 'center',
        width: 240,
        render: (text, record) => {
          return (
            <span>
              {moment.unix(record.created).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          )
        }
      },
      {
        title: '更新时间',
        align: 'center',
        width: 240,
        render: (text, record) => {
          return (
            <span>
              {moment.unix(record.updated).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          )
        }
      },
      {
        title: '操作',
        align: 'center',
        width: 200,
        render: (text, record) => {
          return (
            <OperateButtons>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  this.props.history.push(`/admin/post/edit/${record.id}`)
                }}
              >
                编辑
              </Button>
              <Popconfirm
                title="确认删除吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  this.handleDelete(record)
                }}
              >
                <Button type="danger" size="small">
                  删除
                </Button>
              </Popconfirm>
            </OperateButtons>
          )
        }
      }
    ]
  }

  public componentDidMount () {
    this.fetchList()
  }

  public render () {
    return (
      <div>
        <Table
          dataSource={this.state.dataSource}
          columns={this.columns}
          loading={this.state.loading}
        />
      </div>
    )
  }

  public async fetchList () {
    this.setState({
      loading: true
    })
    const { data } = await this.$models.post.fetchPostList<ListItem>()
    data.list.forEach((l) => {
      l.key = l.id
    })
    this.setState({
      dataSource: data.list
    })
    this.setState({
      loading: false
    })
  }

  public async handleDelete (record: ListItem) {
    try {
      await this.$models.post.delPost(record.id)
      message.success('删除成功')
    } catch (err) {
      throw err
    } finally {
      this.fetchList()
    }
  }
}