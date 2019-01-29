import styled from 'styled-components'

const ToolbarStyle = styled.div`

  .tool-bar {
    display: flex;
    align-self: center;

    .tool-bar-item {
      display: flex;
      align-self: center;
      margin-right: 24px;

      .tool-bar-label {
        margin-right: 12px;
        white-space: nowrap;
      }
    }
  }
`

export {
  ToolbarStyle
}
