import styled, { keyframes } from 'styled-components'

const faceAnimation = keyframes`
2% {
  -webkit-transform: translateY(1.5px) rotate(1.5deg);
  transform: translateY(1.5px) rotate(1.5deg)
}

4% {
  -webkit-transform: translateY(-1.5px) rotate(-.5deg);
  transform: translateY(-1.5px) rotate(-.5deg)
}

6% {
  -webkit-transform: translateY(1.5px) rotate(-1.5deg);
  transform: translateY(1.5px) rotate(-1.5deg)
}

8% {
  -webkit-transform: translateY(-1.5px) rotate(-1.5deg);
  transform: translateY(-1.5px) rotate(-1.5deg)
}

10% {
  -webkit-transform: translateY(2.5px) rotate(1.5deg);
  transform: translateY(2.5px) rotate(1.5deg)
}

12% {
  -webkit-transform: translateY(-.5px) rotate(1.5deg);
  transform: translateY(-.5px) rotate(1.5deg)
}

14% {
  -webkit-transform: translateY(-1.5px) rotate(1.5deg);
  transform: translateY(-1.5px) rotate(1.5deg)
}

16% {
  -webkit-transform: translateY(-.5px) rotate(-1.5deg);
  transform: translateY(-.5px) rotate(-1.5deg)
}

18% {
  -webkit-transform: translateY(.5px) rotate(-1.5deg);
  transform: translateY(.5px) rotate(-1.5deg)
}

20% {
  -webkit-transform: translateY(-1.5px) rotate(2.5deg);
  transform: translateY(-1.5px) rotate(2.5deg)
}

22% {
  -webkit-transform: translateY(.5px) rotate(-1.5deg);
  transform: translateY(.5px) rotate(-1.5deg)
}

24% {
  -webkit-transform: translateY(1.5px) rotate(1.5deg);
  transform: translateY(1.5px) rotate(1.5deg)
}

26% {
  -webkit-transform: translateY(.5px) rotate(.5deg);
  transform: translateY(.5px) rotate(.5deg)
}

28% {
  -webkit-transform: translateY(.5px) rotate(1.5deg);
  transform: translateY(.5px) rotate(1.5deg)
}

30% {
  -webkit-transform: translateY(-.5px) rotate(2.5deg);
  transform: translateY(-.5px) rotate(2.5deg)
}

32% {
  -webkit-transform: translateY(1.5px) rotate(-.5deg);
  transform: translateY(1.5px) rotate(-.5deg)
}

34% {
  -webkit-transform: translateY(1.5px) rotate(-.5deg);
  transform: translateY(1.5px) rotate(-.5deg)
}

36% {
  -webkit-transform: translateY(-1.5px) rotate(2.5deg);
  transform: translateY(-1.5px) rotate(2.5deg)
}

38% {
  -webkit-transform: translateY(1.5px) rotate(-1.5deg);
  transform: translateY(1.5px) rotate(-1.5deg)
}

40% {
  -webkit-transform: translateY(-.5px) rotate(2.5deg);
  transform: translateY(-.5px) rotate(2.5deg)
}

42% {
  -webkit-transform: translateY(2.5px) rotate(-1.5deg);
  transform: translateY(2.5px) rotate(-1.5deg)
}

44% {
  -webkit-transform: translateY(1.5px) rotate(.5deg);
  transform: translateY(1.5px) rotate(.5deg)
}

46% {
  -webkit-transform: translateY(-1.5px) rotate(2.5deg);
  transform: translateY(-1.5px) rotate(2.5deg)
}

48% {
  -webkit-transform: translateY(-.5px) rotate(.5deg);
  transform: translateY(-.5px) rotate(.5deg)
}

50% {
  -webkit-transform: translateY(.5px) rotate(.5deg);
  transform: translateY(.5px) rotate(.5deg)
}

52% {
  -webkit-transform: translateY(2.5px) rotate(2.5deg);
  transform: translateY(2.5px) rotate(2.5deg)
}

54% {
  -webkit-transform: translateY(-1.5px) rotate(1.5deg);
  transform: translateY(-1.5px) rotate(1.5deg)
}

56% {
  -webkit-transform: translateY(2.5px) rotate(2.5deg);
  transform: translateY(2.5px) rotate(2.5deg)
}

58% {
  -webkit-transform: translateY(.5px) rotate(2.5deg);
  transform: translateY(.5px) rotate(2.5deg)
}

60% {
  -webkit-transform: translateY(2.5px) rotate(2.5deg);
  transform: translateY(2.5px) rotate(2.5deg)
}

62% {
  -webkit-transform: translateY(-.5px) rotate(2.5deg);
  transform: translateY(-.5px) rotate(2.5deg)
}

64% {
  -webkit-transform: translateY(-.5px) rotate(1.5deg);
  transform: translateY(-.5px) rotate(1.5deg)
}

66% {
  -webkit-transform: translateY(1.5px) rotate(-.5deg);
  transform: translateY(1.5px) rotate(-.5deg)
}

68% {
  -webkit-transform: translateY(-1.5px) rotate(-.5deg);
  transform: translateY(-1.5px) rotate(-.5deg)
}

70% {
  -webkit-transform: translateY(1.5px) rotate(.5deg);
  transform: translateY(1.5px) rotate(.5deg)
}

72% {
  -webkit-transform: translateY(2.5px) rotate(1.5deg);
  transform: translateY(2.5px) rotate(1.5deg)
}

74% {
  -webkit-transform: translateY(-.5px) rotate(.5deg);
  transform: translateY(-.5px) rotate(.5deg)
}

76% {
  -webkit-transform: translateY(-.5px) rotate(2.5deg);
  transform: translateY(-.5px) rotate(2.5deg)
}

78% {
  -webkit-transform: translateY(-.5px) rotate(1.5deg);
  transform: translateY(-.5px) rotate(1.5deg)
}

80% {
  -webkit-transform: translateY(1.5px) rotate(1.5deg);
  transform: translateY(1.5px) rotate(1.5deg)
}

82% {
  -webkit-transform: translateY(-.5px) rotate(.5deg);
  transform: translateY(-.5px) rotate(.5deg)
}

84% {
  -webkit-transform: translateY(1.5px) rotate(2.5deg);
  transform: translateY(1.5px) rotate(2.5deg)
}

86% {
  -webkit-transform: translateY(-1.5px) rotate(-1.5deg);
  transform: translateY(-1.5px) rotate(-1.5deg)
}

88% {
  -webkit-transform: translateY(-.5px) rotate(2.5deg);
  transform: translateY(-.5px) rotate(2.5deg)
}

90% {
  -webkit-transform: translateY(2.5px) rotate(-.5deg);
  transform: translateY(2.5px) rotate(-.5deg)
}

92% {
  -webkit-transform: translateY(.5px) rotate(-.5deg);
  transform: translateY(.5px) rotate(-.5deg)
}

94% {
  -webkit-transform: translateY(2.5px) rotate(.5deg);
  transform: translateY(2.5px) rotate(.5deg)
}

96% {
  -webkit-transform: translateY(-.5px) rotate(1.5deg);
  transform: translateY(-.5px) rotate(1.5deg)
}

98% {
  -webkit-transform: translateY(-1.5px) rotate(-.5deg);
  transform: translateY(-1.5px) rotate(-.5deg)
}

0%,to {
  -webkit-transform: translate(0) rotate(0);
  transform: translate(0) rotate(0)
}`

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
    bottom: 54px;
    width: 100%;
    pointer-events: none;
  }

  p {
    margin: 5px 0;

    @media only screen and (max-width: 991px) {
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
    }

    a {
      color: #795548;
    }
  }

  .face {
    display: inline-block;
    animation: ${faceAnimation} 5s linear infinite;
  }

  .record {
    cursor: pointer;

    :hover {
      color: white;
      text-decoration: underline;
    }
  }

  .icon-heart {
    color: #d43f57;
  }
`

export {
  FooterStyle
}
