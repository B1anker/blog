import styled from 'styled-components'
import variable from '@/styles/styled/variable'

const AVATAR_SIZE = '200px'
const SOCIAL_ITEM_SIZE = '40px'

const ProfileStyle  = styled.div`
  width: 315px;
  padding: 20px;
  box-sizing: border-box;
  color: #555;
  background: #fff;
  box-shadow: initial;
  border-radius: initial;
  border-radius: 5px;
  z-index: 2;

  @media only screen and (max-width: 991px) {
    display: none;
  }

  .avatar {
    background-image: url(${require('@/assets/avatar.jpg')});
    margin: 0 auto;
    width: ${AVATAR_SIZE};
    height: ${AVATAR_SIZE};
    background-size: 100%;
  }

  .username {
    margin-top: 5px;
    text-align: center;
    font-size: 24px;
    color: #333;
  }

  .social {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    margin-top: 24px;
    padding: 0;

    .social-item {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      width: ${SOCIAL_ITEM_SIZE};
      height: ${SOCIAL_ITEM_SIZE};
      background-color: #eee;
      cursor: pointer;
      transition: background-color ease .3s;

      .icon {
        font-size: 20px;
        color: #333;
        transition: color ease .3s;
      }

      .tooltip {
        position: absolute;
        transition: all ease .5s;
        opacity: 0;
        transform: translateY(-100%);

        .text {
          max-width: 250px;
          padding: 6px 8px;
          color: #fff;
          text-align: left;
          white-space: nowrap;
          text-decoration: none;
          background-color: rgba(0,0,0,.75);
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,.15);
          min-height: 32px;
        }

        .arrow {
          position: absolute;
          width: 0;
          height: 0;
          border-color: transparent;
          border-style: solid;
          border-width: 5px 5px 0;
          border-top-color: rgba(0, 0, 0, .75);
          left: 50%;
          margin-left: -5px;
        }
      }

      &:hover {
        background-color: ${variable.BLUE};

        .tooltip {
          transform: translateY(-150%);
          opacity: 1;
        }

        .icon {
          color: #ffffff;
        }
      }
    }
  }
`

export {
  ProfileStyle
}