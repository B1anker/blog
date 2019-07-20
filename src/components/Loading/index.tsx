import { Icon, Spin } from 'antd'
import isFunction from 'lodash/isFunction'
import omit from 'lodash/omit'
import React from 'react'
import styled from 'styled-components'

const LoadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin={true} />

const LoadingStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

interface LoadingProps {
  child?: () => JSX.Element | React.ElementType
}

const Loading = (props: LoadingProps) => {
  return (
    <LoadingStyle>
      <Spin {...(omit(props, 'child'))} indicator={LoadingIcon} >
        { isFunction(props.child) && props.child() }
      </Spin>
    </LoadingStyle>
  )
}

export default Loading
