import styled from 'styled-components'


const ContentStyle = styled.main`
  display: flex;
  justify-content: space-between;
  width: 1200px;
  margin: 0 auto;
  margin-top: 40px;
  padding-bottom: 380px;

  @media only screen and (max-width: 991px) {
    width: 100%;
    margin-top: 0;
  }

  .posts {
    width: 800px;
    background-color: transparent;

    @media only screen and (max-width: 991px) {
      width: 100%;
    }

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
