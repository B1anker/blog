import styled from 'styled-components'

const FooterStyle = styled.footer`
  position: relative;
  width: 100%;
  background: #232323;
  padding: 15px 0 10px;
  text-align: center;
  color: #888;
  font-size: 12px;
  line-height: 1.5;

  .footer-image {
    background: url(${require('@/assets/footer.png')}) no-repeat 50%;
    height: 368px;
    z-index: 1;
    position: absolute;
    bottom: 48px;
    width: 100%;
    pointer-events: none;
  }
`

export {
  FooterStyle
}
