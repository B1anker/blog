import styled from 'styled-components'


const ContentStyle = styled.main`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 1300px;
  margin: 0 auto;
  margin-top: 40px;
  padding-bottom: 380px;

  @media only screen and (max-width: 991px) {
    width: 100%;
    margin-top: 0;
  }

  .loading {
    margin-bottom: 40px;
    width: 900px;
    border-radius: 5px;
    background: white;
    display: flex;
    align-items: center;

    .ant-spin {
      margin: 0 auto;
    }
  }

  .empty {
    text-align: center;
    line-height: 48px;
    font-weight: bolder;
    font-size: 24px;
  }

  .posts {
    width: 900px;
    background-color: transparent;

    @media only screen and (max-width: 991px) {
      width: 100%;
    }

    .post {
      margin-top: 60px;
      border-radius: 5px;

      &:first-child {
        margin-top: 0;
      }
    }
  }
  .post-comment {
    width: 900px;
    background: #fff;
    margin: 0;
    padding: 40px;
    border-radius: 5px;
  }
`

export {
  ContentStyle
}
