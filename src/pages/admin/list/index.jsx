import React, { Component } from 'react'
import { Button, Table } from 'antd'
import moment from 'moment'

export default class List extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: []
    }
    this.columns = [{
      title: '_id',
      dataIndex: '_id',
      key: '_id',
      align: 'center',
      width: 220
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    }, {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      align: 'center'
    }, {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      align: 'center'
    }, {
      title: '创建时间',
      align: 'center',
      width: 170,
      render: (text, record) => {
        return (
          <span>{ moment(record.meta.createdAt).format('YYYY-MM-DD hh:mm:ss') }</span>
        )
      }
    }, {
      title: '更新时间',
      align: 'center',
      width: 170,
      render: (text, record) => {
        return (
          <span>{ moment(record.meta.updateAt).format('YYYY-MM-DD hh:mm:ss') }</span>
        )
      }
    }, {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <Button type='primary' onClick={() => {
            this.props.history.push(`/admin/post/edit/${record._id}`)
          }}>编辑</Button>
        )
      }
    }]
  }

  async componentDidMount () {
    const { data } = await this.$models.post.fetchPostList()
    data.forEach((d) => {
      d.key = d._id
    })
    this.setState({
      dataSource: data
    })
  }


  render () {
    return (
      <div>
        <Table dataSource={this.state.dataSource} columns={this.columns} />
      </div>
    )
  }
}