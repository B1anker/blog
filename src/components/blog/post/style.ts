import styled from 'styled-components'
import { CodeStyle } from '../../admin/markdown/style'


const BLUE = '#97dffd'
const ORANGE = '#ff3f1a'
const PURPLE = '#8378EA'

const center = (justify: string) => {
  return `
    display: flex;
    justify-content: ${justify};
    align-items: center;
  `
}

const border = (border) => {
  return `border-radius: ${border};`
}

const PostStyle = styled.div`
  width: 100%;
  background-color: white;
  position: relative;
  padding: 40px;
  background: #fff;
  margin-bottom: 40px;
  border-radius: 5px;

  .post-header {
    .post-title, .post-title-link {
      text-align: center;
      color: #444;
      font-size: 25px;
      font-weight: 700;
    }
      
    .post-meta {
      ${center('center')};

      .published {
        color: ${PURPLE};
      }

      .category {
        color: ${BLUE};
        a {
          color: ${BLUE};
        }
      }
      
      .visited {
        color ${ORANGE};
      }

      .prefix {
        @media only screen and (max-width: 991px) {
          display: none;
        }
      }

      .iconfont {
        margin-right: 3px;
      }

      .split {
        margin: 0 12px;
        color: #666;
        font-size: 20px;
      }
    }
  }

  .post-date {
    height: 70px;
    width: 70px;
    border-radius: 50%;
    position: absolute;
    transform: translate(-40%, -40%);
    top: 0;
    left: 0;
    padding-top: 10px;
    background-color: ${BLUE};
    line-height: 1.1;
    text-align: center;
    color: #fff;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);

    @media only screen and (max-width: 991px) {
      display: none;
    }
    
    .post-day {
      font-size: 30px;
      font-weight: 700;
    }
  }

  .post-content {
    margin-top 60px;

    ${CodeStyle}
  }
  
  .post-badage {
    ${border('0 4px 4px 0')};
    position: absolute;
    left: -16px;
    top: 105px;
    padding: 7px 11px 7px 32px;
    line-height: 1;
    background-color: ${BLUE};
    border-color: #47456d;
    color: white;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);

    @media only screen and (max-width: 991px) {
      display: none;
    }

    a {
      color: white;
    }
    
    &:after {
      content: '';
      position: absolute;
      top: 100%;
      left: 0;
      border-top: 0 solid transparent;
      border-right-width: 1em;
      border-right-color: inherit;
      border-right-style: solid;
      border-bottom: 1em solid transparent;
      border-left: 0 solid transparent;
      width: 0;
      height: 0;
    }
  }

  .read-all {
    text-align: center;

    .btn {
      border-radius: 5px;
      display: inline-block;
      background: ${BLUE};
      padding: 1px 15px ;
      color: white;
      line-height: 2;
    }
  }
`

const PopupStyle = styled.div`
.fade-enter {
  opacity: 0.01;
  img {
    transform: scaleY(0);
  }
}

.fade-enter-active {
  opacity: 1;
  transition: all 300ms ease-in;
  img {
    transform: scaleY(1);
    transition: all 300ms ease-in;
  }
}

.fade-exit {
  opacity: 1;
}

.fade-exit-active {
  opacity: 0.01;
  transition: all 300ms ease-in;
}

.popup-mask {
  position: fixed;
  z-index: 9998;
  background-color: rgba(0, 0, 0, .6);
  transition: all ease-in .1s;
}

.popup-image {
  transition: all ease-in .2s;
  position: fixed;
  z-index: 9999;
  max-height: 90%;
}
`

export {
  PostStyle,
  PopupStyle
}