import Toolbar, { MenuItem } from '@/components/Toolbar'
import secretsApi, { SecretModel } from '@/models/secrets'
import {
  Button,
  Form,
  Icon,
  Input,
  message,
  Popconfirm,
  Table,
  Tag
} from 'antd'
import { ColumnProps } from 'antd/lib/table'
import defaultsDeep from 'lodash/defaultsDeep'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import AddSecretModal from './AddSecretModal'
import EditableCell, { EditableFormRow } from './EditableCell'
import { SecretsStyle } from './style'

const setInitialToolbarOfState = (menu: MenuItem[]) => {
  const map: any = {}
  menu.forEach((menuItem) => {
    map[menuItem.key] = menuItem.defaultValue
  })
  return map
}

const defaultMenu: MenuItem[] = [
  {
    type: 'input',
    key: 'key',
    name: '键',
    width: 300
  }
]

interface Column extends ColumnProps<SecretModel & { index: number }> {
  editable?: boolean
}

const menu = defaultsDeep([], defaultMenu)
let originDataSource: Array<SecretModel & { index: number }> = []

const Secrets = () => {
  const [dataSource, setDataSource] = useState<SecretModel[]>([])
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [addSecretModalVisible, setAddSecretModalVisible] = useState<boolean>(
    false
  )
  const [loading, setLoading] = useState<boolean>(true)
  const [toolbar, setToolbar] = useState<any>(setInitialToolbarOfState(menu))

  useEffect(() => {
    secretsApi.getSecrets().then((response) => {
      const secrets = response.data.list.map((secret, index) => {
        return { ...secret, index }
      })
      originDataSource = secrets
      setDataSource(originDataSource)
      setLoading(false)
    })
  }, [])

  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell
    }
  }

  const handleSave = async (
    row: SecretModel & { value: string },
    index: number
  ) => {
    const updateSecretOptions = {
      key: row.key,
      value: row.value,
      desc: row.desc
    }
    await secretsApi.updateSecret(updateSecretOptions)
    const newDataSource = defaultsDeep([], originDataSource)
    Object.assign(newDataSource[index], updateSecretOptions)
    setDataSource(newDataSource)
    message.success('修改成功！')
  }

  const openAddSecretModal = () => {
    setAddSecretModalVisible(true)
  }

  const handleDelete = async (index: number) => {
    setLoading(true)
    try {
      await secretsApi.deleteSecret(originDataSource[index].key)
      originDataSource.splice(index, 1)
      message.success('删除成功')
      setDataSource([...originDataSource])
    } catch (err) {
      message.error('删除失败')
    }
    setLoading(false)
  }

  const handleToolbarChange = (key: string, value: string) => {
    setToolbar({
      ...toolbar,
      [key]: value
    })
    setDataSource(
      originDataSource.filter(({ key }) => !value || key.includes(value))
    )
  }

  const handleAddSecretCancel = () => {
    setAddSecretModalVisible(false)
  }

  const handleAddSecretOk = () => {
    setLoading(true)
    secretsApi.getSecrets().then((response) => {
      const secrets = response.data.list.map((secret, index) => {
        return { ...secret, index }
      })
      originDataSource = secrets
      setDataSource(originDataSource)
      setLoading(false)
      setAddSecretModalVisible(false)
    })
  }

  const columns: Column[] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 160
    },
    {
      title: '键',
      dataIndex: 'key',
      key: 'key',
      align: 'center'
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      editable: true,
      align: 'center',
      render: () => {
        return <span>******</span>
      }
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      editable: true,
      align: 'center',
      render: (text) => {
        return <span>{text || '-'}</span>
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
      width: 100,
      render: (text, record) => {
        return dataSource.length >= 1 ? (
          <Popconfirm
            title={`确认要删除${record.key}?`}
            onConfirm={() => handleDelete(record.index)}
            cancelText="取消"
            okText="确认"
          >
            <Button type="danger" size="small">
              删除
            </Button>
          </Popconfirm>
        ) : null
      }
    }
  ]

  return (
    <SecretsStyle>
      <Toolbar
        menu={defaultsDeep([], defaultMenu)}
        onChange={(key: string, value) => handleToolbarChange(key, value)}
        toolbar={toolbar}
        append={
          <Button type="primary" onClick={openAddSecretModal}>
            添加
          </Button>
        }
      />
      <Table
        className="table"
        loading={loading}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered={true}
        dataSource={dataSource}
        columns={columns.map((col) => {
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
              handleSave: (row) => handleSave(row, record.index)
            })
          }
        })}
      />
      <AddSecretModal
        visible={addSecretModalVisible}
        mode={mode}
        handleCancel={handleAddSecretCancel}
        handleOk={handleAddSecretOk}
      />
    </SecretsStyle>
  )
}

export default Secrets
