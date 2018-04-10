import styled from 'styled-components'

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
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;

    .social-item {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      width: ${SOCIAL_ITEM_SIZE};
      height: ${SOCIAL_ITEM_SIZE};
      background-color: #eee;
      cursor: pointer;
    }

    .icon {
      font-size: 20px;
      color: #333;
    }
`

export {
  ProfileStyle
}