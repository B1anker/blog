import React, { Component } from 'react'
import omit from 'lodash/omit'
import { PopupStyle } from './style'

interface PopupItemProperty {
  width: number
  height: number
  top: number
  left: number
}

interface MaskProperty extends PopupItemProperty {
  opacity: number
}

interface ClickedImageProperty extends PopupItemProperty {
  naturalHeight: number
  naturalWidth: number
}

interface PopupState {
  imgUrl: string
  active: boolean
  popupImage?: PopupItemProperty
  maskProperty?: MaskProperty
}

export default class Popup extends Component<{}, PopupState> {
  private ref: React.RefObject<HTMLDivElement> = React.createRef()
  private clickedImageProperty: ClickedImageProperty
  private pageWidth: number
  private pageHeight: number

  constructor (props) {
    super(props)
    this.state = {
      imgUrl: '',
      active: false
    }
  }

  public componentDidMount () {
    this.getInitialData()
    this.attachEvent()
  }
  
  public render () {
    const { active, maskProperty, popupImage } = this.state
    if (active && popupImage && maskProperty) {
      return <PopupStyle className="popup" innerRef={this.ref as any}>
        { this.props.children }
        <div className="popup-mask"
          key="mask"
          style={{
            width: maskProperty.width + 'px',
            height: maskProperty.height + 'px',
            top: maskProperty.top + 'px',
            left: maskProperty.left + 'px',
            opacity: maskProperty.opacity
          }}
          onClick={(e) => this.close(e)}>
        </div>
        <img className="popup-image"
          key="img"
          style={{
            width: popupImage.width + 'px',
            height: popupImage.height + 'px',
            top: popupImage.top + 'px',
            left: popupImage.left + 'px'
          }}
          src={this.state.imgUrl}
          alt=""
        />
      </PopupStyle>
    }
    return (
      <PopupStyle className="popup" innerRef={this.ref as any}>
        { this.props.children }
      </PopupStyle>
    )
  }

  private close (e: any) {
    if (e.target.tagName !== 'IMG') {
      this.setState({
        popupImage: omit(this.clickedImageProperty, [
          'naturalHeight',
          'naturalWidth'
        ]),
        maskProperty: {
          ...omit(this.clickedImageProperty, [
            'naturalHeight',
            'naturalWidth'
          ]),
          opacity: 0
        }
      })
      setTimeout(() => {
        this.setState({
          active: false
        })
      }, 200)
    }
  }

  private getInitialData () {
    if (document.documentElement) {
      this.pageWidth = document.documentElement.clientWidth
      this.pageHeight = document.documentElement.clientHeight
    }
  }

  private attachEvent () {
    if (this.ref.current) {
      this.ref.current.addEventListener('click', (e: any) => {
        const target = e.target
        if (target.tagName === 'IMG') {
          this.setClickedImageProperty(target)
          this.movePopupToOrigin(target.src)
          this.openPopup()
        }
      }, false)
    }
  }

  private movePopupToOrigin (src: string) {
    this.setState({
      imgUrl: src,
      active: true,
      popupImage: omit(this.clickedImageProperty, [
        'naturalHeight',
        'naturalWidth'
      ]),
      maskProperty: {
        ...omit(this.clickedImageProperty, [
          'naturalHeight',
          'naturalWidth'
        ]),
        opacity: 0
      }
    })
  }

  private openPopup () {
    setTimeout(() => {
      const { naturalHeight, naturalWidth } = this.clickedImageProperty
      let popupImageTop: number
      let popupImageLeft: number
      let popupImageWidth: number
      let popupImageHeight: number
      let maxHeight = this.pageHeight * .9
      let maxWidth = this.pageWidth * .9
      if (naturalHeight > this.pageHeight) {
        popupImageHeight = maxHeight
        if (naturalWidth > this.pageWidth) {
          if (naturalWidth / this.pageWidth > naturalHeight / this.pageHeight) {
            // 宽度超出的比例比高度超出的比例要大，按照宽度比例来计算高度
            popupImageWidth = maxWidth
            popupImageHeight = naturalHeight / naturalWidth * maxWidth
          } else {
            popupImageWidth = naturalWidth / naturalHeight * popupImageHeight
          }
        } else {
          popupImageWidth = naturalWidth / naturalHeight * popupImageHeight
        }
      } else {
        if (naturalWidth > this.pageWidth) {
          popupImageWidth = maxWidth
          popupImageHeight = naturalHeight / naturalWidth * maxWidth
        } else {
          popupImageHeight = naturalHeight
          popupImageWidth = naturalWidth
        }
      }
      popupImageTop = (this.pageHeight - popupImageHeight) / 2
      popupImageLeft = (this.pageWidth - popupImageWidth) / 2
      this.setState({
        popupImage: {
          width: popupImageWidth,
          height: popupImageHeight,
          left: popupImageLeft,
          top: popupImageTop,
        },
        maskProperty: {
          width: this.pageWidth,
          height: this.pageHeight,
          left: 0,
          top: 0,
          opacity: 1
        }
      })
    })
  }

  private setClickedImageProperty (el: HTMLImageElement) {
    if (el.getBoundingClientRect()) {
      const { naturalHeight, naturalWidth } = el
      const { height, width, left, top } = el.getBoundingClientRect()
      this.clickedImageProperty = {
        naturalHeight,
        naturalWidth,
        height,
        width,
        left,
        top
      }
    }
  }
}
