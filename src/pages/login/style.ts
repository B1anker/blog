import styled from 'styled-components'

const LoginStyle = styled.div`
  background: url(${require('@/assets/login-bg.jpg')});
  height: 100%;
  overflow: hidden;

  .container {
    margin: 300px auto 0 auto;
    width: 368px;

    .title {
      text-align: center;
      color: #B2D9F8;
    }

    .form {
      margin-top: 30px;

      .submit {
        width: 100%;
        height: 40px;
      }

      .remember-text {
        color: #B2D9F8;
      }
    }
  }
`

export default LoginStyle
