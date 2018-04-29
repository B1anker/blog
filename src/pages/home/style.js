import styled from 'styled-components'


const ContentStyle = styled.main`
  display: flex;
  justify-content: space-between;
  width: 1200px;
  margin: 0 auto;
  margin-top: 40px;
  padding-bottom: 380px;

  .posts {
    width: 800px;
    background-color: transparent;

    .post {
      margin-top: 60px;

      &:first-child {
        margin-top: 0;
      }
    }
  }
`

export {
  ContentStyle
}
