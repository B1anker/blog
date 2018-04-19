import React, { Component } from 'react'
import { Table } from 'antd'

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
      title: '摘要',
      dataIndex: 'summary',
      key: 'summary',
      align: 'center',
      width: 300
    }, {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      align: 'center'
    }]
  }

  async componentDidMount () {
    const { data } = await this.$models.post.fetchPostList()
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