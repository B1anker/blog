import styled from 'styled-components'
import { Button } from 'antd'

const MarkDownStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  width: 100%;
  height: calc(100% - 40px);
`

const SubmitStyle = styled(Button)`
  margin-top: 10px;
`

const EditorStyle = styled.div`
  width: 50%;
  height: 100%;
  border: 1px solid #d3d3d3;
  box-shadow: 0 0 3px rgba(0, 0, 0, .4);
  border-radius: 5px 0 0 5px;

  .CodeMirror {
    height: 100%;
  }
`

const RendererStyle = styled.div`
  width: 50%;
  height: 100%;
  border: 1px solid #d3d3d3;
  box-shadow: 0 0 3px rgba(0, 0, 0, .4);
  border-radius: 0 5px 5px 0;
  overflow-y: auto;

  .renderer {
    padding: 12px 12px 12px 24px;
    font-size: 16px;
    line-height: 1.5em;
    color: #444;
  }

  li {
    list-style: disc;
  }

  pre {
    border: 1px solid #ccc;
  }
  
  blockquote {
    color: #666;
    margin: 0;
    padding-left: 3em;
    border-left: 0.5em #eee solid;
  }
  
  tr {
    border-top: 1px solid #c6cbd1;
    background: #fff;
  }
  
  th,
  td {
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
  }
  
  table tr:nth-child(2n) {
    background: #f6f8fa;
  }
`

export {
  EditorStyle,
  MarkDownStyle,
  RendererStyle,
  SubmitStyle
}