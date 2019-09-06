import styled from 'styled-components'

const PostEditStyle = styled.div`
  height: 100%;

  .tags {
    margin-top: 16px;
  }

  .markdown-wrap.fullscreen-controller {
    margin-top: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 999;
    left: 0;
    top: 0px;
    background: white;

    #CodeMirror {
      border: none;
      border-radius: 0;
    }
  }

  .markdown-wrap {
    margin-top: 16px;
    position: relative;

    .submit {
      margin-top: 10px;
      float: right;
    }

    .fullscreen-controller {
      position: absolute;
      top: 15px;
      right: 15px;
      cursor: pointer;
      font-size: 20px;
      font-weight: bolder;
    }
  }
`

export {
  PostEditStyle
}
