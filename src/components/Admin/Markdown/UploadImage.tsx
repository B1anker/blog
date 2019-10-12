import upload from '@/models/upload'
import { message, Modal } from 'antd'
import defaultsDeep from 'lodash/defaultsDeep'
import * as qiniu from 'qiniu-js'
import { Subscription } from 'qiniu-js'
import React, { useEffect, useState } from 'react'
import ImageItem from './ImageItem'
import { UploadImageStyle } from './style'

export interface Resource {
  name: string
  url: string
}

interface UploadImageProps {
  files: File[]
  visible: boolean
  onCancel: (resources: Resource[]) => void
}

let token: string
let subscriptions: Subscription[]

interface FileData {
  data: string
  name: string
  loaded: boolean
  percent: number
}

const UploadImage = (props: UploadImageProps) => {
  const [filesData, setFilesData] = useState<FileData[]>([])

  useEffect(() => {
    upload.getQiniuToken<{ token: string }>().then((res) => {
      token = res.data.token
    })
  }, [])

  useEffect(() => {
    const files = Array.from(props.files)
    const initialFilesData = files.map(({ name }) => {
      return {
        data: '',
        name,
        loaded: false,
        percent: 0
      }
    })
    setFilesData(initialFilesData)
    files.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        const fileData = initialFilesData[index]
        fileData.data = e.target.result
        fileData.loaded = true
        const newFilesData = defaultsDeep([], initialFilesData)
        setFilesData(newFilesData)
      }
      reader.readAsDataURL(file)
    })
  }, [props.files])

  const updateFilesData = (callback) => {
    const newFilesData = Array.from(filesData)
    callback(newFilesData)
    setFilesData(newFilesData)
  }

  const handleOk = () => {
    subscriptions = Array.from(props.files).map((file, index) => {
      const observable = qiniu.upload(
        file,
        filesData[index].name,
        token,
        {
          fname: filesData[index].name,
          params: {},
          mimeType: ['image/png', 'image/jpeg', 'image/gif']
        },
        {
          useCdnDomain: true,
          region: qiniu.region.z2
        }
      )
      return observable.subscribe((res) => {
        const newFilesData = Array.from(filesData)
        newFilesData[index].percent = ~~res.total.percent
        setFilesData(newFilesData)
      }, (err: any) => {
        message.error(`${filesData[index].name}: ${err.message}`)
      })
    })
  }

  const handleCancel = () => {
    Array.isArray(subscriptions) && subscriptions.forEach((subscription) => {
      subscription.unsubscribe()
    })
    props.onCancel(filesData.filter(({ percent }) => percent === 100)
      .map(({ name }) => {
        return {
          url: `https://cdn.b1anker.com/${name}`,
          name
        }
      })
    )
  }

  const handleDelete = (index) => {
    filesData.splice(index)
    setFilesData(filesData.slice(0, index).concat(filesData.slice(index + 1)))
  }

  const handleNameChange = (name: string, index: number) => {
    updateFilesData((newFilesData) => {
      newFilesData[index].name = name
    })
  }

  return (
    <Modal
      title="图片上传"
      visible={props.visible}
      onCancel={() => handleCancel()}
      onOk={() => handleOk()}
      okText="上传"
      cancelText="取消"
    >
      <UploadImageStyle>
        {filesData.map(({ data, name, loaded, percent }, index) => {
          return (
            <ImageItem
              loaded={loaded}
              src={data}
              name={name}
              key={index}
              index={index}
              percent={percent}
              onDelete={(index) => handleDelete(index)}
              onNameChange={(name, index) => handleNameChange(name, index)}
            />
          )
        })}
      </UploadImageStyle>
    </Modal>
  )
}

export default UploadImage
