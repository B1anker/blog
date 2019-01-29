import { Input } from 'antd'
import React, { Component } from 'react'
import { FaceStyle } from './style'

const { TextArea } = Input

interface FaceState {
  text: string,
  canvasToDataURL: string
}

export default class Face extends Component<{}, FaceState> {
  private img: HTMLElement | null = null
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  constructor (props) {
    super(props)
    this.state = {
      text: '2018年5月21日 没人给我点赞，这个仇我先记下来了',
      canvasToDataURL: ''
    }
  }

  get width () {
    return this.canvas ? this.canvas.width : 0
  }

  get height () {
    return this.canvas ? this.canvas.height : 0
  }

  public async componentDidMount () {
    this.img = document.querySelector('#img')
    this.canvas = document.querySelector('#canvas')
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d')
      await this.initCanvas()
      this.fillText(this.state.text)
      this.setState({
        canvasToDataURL: this.canvas.toDataURL('image/png')
      })
    }
  }

  public render () {
    return (
      <FaceStyle>
        <div className="input-container">
          <img id="img"
            src={ require('@/assets/grudges.png') }
            alt="记仇"/>
          <TextArea value={this.state.text}
            onChange={(e) => {
              this.onChangeText(e)
            }}
            placeholder="请输入你的记仇咯~" />
        </div>
        <div className="display-container">
          <canvas id="canvas" width={200} height={205} />
          <img className="replace-img" src={this.state.canvasToDataURL} alt="from canvas"/>
        </div>
      </FaceStyle>
    )
  }

  public onChangeText (e) {
    this.fillText(e.target.value)
    if (this.canvas) {
      this.setState({
        text: e.target.value,
        canvasToDataURL: this.canvas.toDataURL('image/png')
      })
    }
  }

  public async initCanvas () {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(0, 0, this.width, this.height)
      const img = await this.loadImage('https://cdn.b1anker.com/grudges.png')
      this.drawImage(img)
      return Promise.resolve()
    }
  }

  public fillText (text) {
    if (!text) {
      this.initCanvas()
      return
    }
    if (this.ctx) {
      this.ctx.clearRect(0, 155, 200, this.height - 155)
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(0, 155, 200, this.height - 155)
      this.ctx.font = '14px sans-serif'
      this.ctx.fillStyle = 'black'
      const boundary = this.width - 20
      let initHeight = 175
      let lastIndex = 0
      let j = 0
      for (let i = 0; i < text.length; i++) {
        const currTextWidth = this.ctx.measureText(text.substring(lastIndex, i)).width
        if ( currTextWidth > boundary) {
          this.ctx.fillText(text.substring(lastIndex, i), 8, initHeight)
          initHeight += 20
          lastIndex = i
          j++
          this.resize(j)
        }
        if (i === text.length - 1) { // 绘制剩余部分
          this.ctx.fillText(text.substring(lastIndex, i + 1), 8, initHeight)
        }
      }
      this.resize(j)
    }
  }

  public resize (deep) {
    if (deep > 1) {
      if (this.ctx && this.canvas) {
        const store = this.ctx.getImageData(0, 0, this.width, this.height)
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.canvas.setAttribute('height', (200 + (deep - 1) * 20).toString())
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(0, 155, 200, this.height - 155)
        this.ctx.font = '14px sans-serif'
        this.ctx.fillStyle = 'black'
        this.ctx.putImageData(store, 0, 0)
      }
    }
  }

  public loadImage (url, crossOrigin = true) {
    return new Promise ((resolve, reject) => {
      const img = document.createElement('img')
      if (crossOrigin) {
        img.crossOrigin = 'anonymous'
      }
      img.onload = () => {
        resolve(img)
      }
      img.onerror = (err) => {
        reject(err)
      }
      img.src = url
    })
  }

  public drawImage (img) {
    if (this.ctx) {
      const sWidth = img.width
      const sHeight = img.height
      const scale = Number(~~((200 / sWidth) * 10000) / 10000)
      this.ctx.drawImage(
        img,
        0, 0, sWidth, sHeight,
        0, 0, 200, sHeight * scale
      )
    }
  }
}
