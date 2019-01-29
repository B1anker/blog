import styled from 'styled-components'

const ToolbarStyle = styled.div`

  .tool-bar {
    overflow: hidden;

    .main {
      display: flex;
      align-items: center;
      float: left;

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

    .append {
      float: right;
    }
  }
`

export {
  ToolbarStyle
}
