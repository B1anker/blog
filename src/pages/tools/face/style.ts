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
    position: relative;
    display: flex;
    justify-content: center;


    .replace-img {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
    }
  }
`

export {
  FaceStyle
}
