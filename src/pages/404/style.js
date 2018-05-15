import styled from 'styled-components'

const NotFoundStyle = styled.div`
  width: 800px;
  margin: 100px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;


  .image {
    height: 360px;
    width: 430px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: contain;
    background-image: url('https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg');
  }

  .title {
    color: #434e59;
    font-size: 72px;
    font-weight: 600;
    line-height: 72px;
    margin-bottom: 24px;
  }

  .tip {
    color: rgba(0,0,0,.45);
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 16px;
  }
`

export {
  NotFoundStyle
}
