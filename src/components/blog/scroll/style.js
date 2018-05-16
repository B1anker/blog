import styled from 'styled-components'

const ScrollStyle = styled.div`
  cursor: pointer;
  position: fixed;
  right: 50px;
  top: -900px;
  z-index: 2;
  width: 70px;
  height: 900px;
  background: url(${require('../../../assets/scroll.png')});
  transition: all .5s ease-in-out;
  opacity: 1;

  &.active {
    top: -20px;
  }
`

export {
  ScrollStyle
}