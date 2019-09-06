import { Icon, Input, Progress } from 'antd'
import React from 'react'
import Loading from '../../Loading'
import { UploadImageItemStyle } from './style'

interface ImageItemProps {
  src: string
  name: string
  onDelete: (index: number) => void
  onNameChange: (name: string, index: number) => void
  index: number
  loaded: boolean
  percent: number
}

const ImageItem = (props: ImageItemProps) => {
  return (
    <UploadImageItemStyle className="upload-image-item">
      <div className="preview">
        {props.loaded ? (
          <img className="preview-image" src={props.src} alt="" />
        ) : (
          <Loading />
        )}
      </div>
      <div className="desc">
        <Input
          className="name"
          value={props.name}
          onChange={(e) => props.onNameChange(e.target.value, props.index)}
        />
        <Progress percent={props.percent} showInfo={true} />
      </div>
      <Icon
        type="close"
        className="delete"
        onClick={() => props.onDelete(props.index)}
      />
    </UploadImageItemStyle>
  )
}

export default ImageItem
