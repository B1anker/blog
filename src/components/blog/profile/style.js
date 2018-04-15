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

  .avatar {
    background-image: url(${require('@/assets/avatar.jpg')});
    margin: 0 auto;
    width: ${AVATAR_SIZE};
    height: ${AVATAR_SIZE};
    background-size: 100%;
  }

  .social {
    width: 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    margin-top: 24px;
    padding: 0;

    .social-item {
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

      &:hover {
        background-color: ${variable.BLUE};

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