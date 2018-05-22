import styled from 'styled-components'

const FaceStyle = styled.div`
  overflow: hidden;

  .input-container {
    width: 200px;
    margin: 50px auto;

    img {
      width: 100%;
      margin-bottom: 20px;
    }
  }

  .display-container {
    display: flex;
    justify-content: center;

    #canvas {
    }
  }
`

export {
  FaceStyle
}