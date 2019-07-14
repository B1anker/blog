import styled from 'styled-components'

const ArticleStyle = styled.div`
  .loading {
    padding: 24px;
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
    width: 100%;
    background: #fff;
    margin: 0;
    padding: 40px;
    border-radius: 5px;
  }
`

export default ArticleStyle
