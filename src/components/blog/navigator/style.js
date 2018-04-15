import styled from 'styled-components'
import variable from '../../style/variable'

const MenuHeight = '48px'
const NavItemHeight = '48px'

const Navigator = styled.nav`
  position absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 3;
  box-shadow: 0 1px 4px 2px rgba(0, 0, 0, 0.1);
`

const Menu = styled.ul`
  position: relative;
  display: flex;
  width: 1110px;
  margin: 0 auto;
  z-index: 3;
`

const MenuItem = styled.li`
  height: ${ MenuHeight };
  line-height: ${ MenuHeight };
  margin-right: 12px;

  &:last-child {
    margin-right: 0;
  }

  a {
    display: flex;
    align-items: center;
    padding: 0 12px;
    color: #666;
    line-height: ${ NavItemHeight };

    &:hover {
      transition: all ease .5s;
      background: hsla(0, 0%, 100%, .7);
      color: #555;
    }

    i {
      margin-right: 8px;
      color: ${ variable.pink };
    }
  }
`

const Blur = styled.div`
  position absolute;
  left: 0;
  right: 0;
  top: 0;
  height: ${ NavItemHeight };
  filter: blur(4px);
  background-image: url('/src/assets/poster.png');
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
`
export {
  Navigator,
  Menu,
  MenuItem,
  Blur
}
