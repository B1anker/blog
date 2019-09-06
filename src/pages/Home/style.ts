import styled from 'styled-components'

const MainContentStyle = styled.main`
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

  .left-content {
    width: 900px;
    background-color: transparent;

    @media only screen and (max-width: 991px) {
      width: 100%;
    }
  }
`

export {
  MainContentStyle
}
