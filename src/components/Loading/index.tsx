import { Icon, Spin } from 'antd'
import React from 'react'
import styled from 'styled-components'

const LoadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin={true} />

const LoadingStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Loading = (props) => {
  return (
    <LoadingStyle>
      <Spin {...props} indicator={LoadingIcon} />
    </LoadingStyle>
  )
}

export default Loading
