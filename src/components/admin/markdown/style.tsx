import styled from 'styled-components'

const MarkDownStyle = styled.div<{height?: number}>((props: any) => `
.ant-spin-nested-loading, .ant-spin-container {
  height: 100%;
}
.ant-spin-spinning {
  max-height: none !important;
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  width: 100%;
  height: ${props.height || 600}px;
  transition: height ease .3s;
}
`)

const EditorStyle = styled.div`
  width: 50%;
  height: 100%;
  border: 1px solid #d3d3d3;
  box-shadow: 0 0 3px rgba(0, 0, 0, .4);
  border-radius: 5px 0 0 5px;
  overflow: hidden;

  .CodeMirror {
    height: 100%;
  }
`
const CodeStyle = `
.prism-highlight {
  margin-bottom: 36px !important;
}

h1, h2, h3, h4, h5, h6 {
  margin: 16px 0;
}

p {
  text-indent: 2em;
}

table {
  margin-bottom: 1em;
  margin: 0 auto 1em auto;

  tr {
    border-top: 1px solid #c6cbd1;
    background: #fff;
  }

  th,
  td {
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
  }
}

table tr:nth-child(2n) {
  background: #f6f8fa;
}

ul {
  margin-left: 2.5em;

  li {
    list-style: disc;
    margin: .5em 0;
  }
}

pre {
  border: 1px solid #ccc;
}

blockquote {
  color: #666;
  margin: 1.5em 0;
  border-left: 0.5em #eee solid;
  padding-left: 1em;

  p {
    text-indent: 0;
    margin-bottom: 0;
  }
}

p, blockquote, li {
  code {
    background-color: #fff5f5;
    color: #ff502c;
    padding: .3em .4em;
    margin: 0 .4em;
    border-radius: 4px;
  }
}

img {
  display: block;
  cursor: zoom-in;
  margin: 0 auto;
  max-width: 100%;
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

  ${CodeStyle}
`

export {
  CodeStyle,
  EditorStyle,
  MarkDownStyle,
  RendererStyle
}
