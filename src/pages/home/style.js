import styled from 'styled-components'


const ContentStyle = styled.main`
  display: flex;
  flex-wrap: wrap;
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
  .post-comment {
    width: 800px;
    background: #fff;
    margin: 0;
    padding: 40px;
    border-radius: 5px;
  }
`

export {
  ContentStyle
}
