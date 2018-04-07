import styled from 'styled-components'

const NavItemHeight = '48px'

const Blur = styled.div`
  position absolute;
  left: 0;
  right: 0;
  top: 0;
  height: ${ NavItemHeight };
  filter: blur(4px);
  background-image: url(${require('../../../assets/poster.png')});
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
`

const Poster = styled.div`
  width: 100%;
  height: 650px;
  background-image: url(${require('../../../assets/poster.png')});
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
`

export {
  Blur,
  Poster
}
