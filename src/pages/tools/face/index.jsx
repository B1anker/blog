import React, { Component } from 'react'
import { Input } from 'antd'
import { FaceStyle } from './style'

const { TextArea } = Input

export default class Face extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '2018年5月21日 没人给我点赞，这个仇我先记下来了'
    }
    this.img = null
    this.canvas = null
    this.ctx = null
  }

  get width () {
    return this.canvas ? this.canvas.width : 0
  }

  get height () {
    return this.canvas ? this.canvas.height : 0
  }

  componentDidMount () {
    this.img = document.querySelector('#img')
    this.canvas = document.querySelector('#canvas')
    this.ctx = this.canvas.getContext('2d')
    this.initCanvas()
    this.ctx.save()
    this.fillText(this.state.text)
  }

  render () {
    return (
      <FaceStyle>
        <div className='input-container'>
          <img id="img"
            src={ require('../../../assets/grudges.png') }
            alt='记仇'/>
          <TextArea type='textarea'
            value={this.state.text}
            onChange={(e) => {
              this.onChangeText(e)
            }}
            placeholder='请输入你的记仇咯~'>
          </TextArea>
        </div>
        <div className='display-container'>
          <canvas id='canvas' width={200} height={205}></canvas>
        </div>
      </FaceStyle>
    )
  }

  onChangeText (e) {
    this.setState({
      text: e.target.value
    })
    this.fillText(e.target.value)
  }

  async initCanvas () {
    this.canvas.setAttribute('height', 200)
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, this.width, this.height)
    const img = await this.loadImage(require('../../../assets/grudges.png'))
    this.drawImage(img)
  }

  fillText (text) {
    if (!text) {
      this.initCanvas()
      return
    }
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
      const nextTextWidth = this.ctx.measureText(text.substring(lastIndex, i + 1)).width
      if ( currTextWidth > boundary || (nextTextWidth - boundary) > 4) {
        this.ctx.fillText(text.substring(lastIndex, i), 8, initHeight)
        initHeight += 20
        lastIndex = i
        j++
        this.resize(j)
      }
      if (i === text.length - 1) { //绘制剩余部分
        this.ctx.fillText(text.substring(lastIndex, i + 1), 8, initHeight)
      }
    }
    this.resize(j)
  }

  resize (deep) {
    if (deep > 1) {
      const store = this.ctx.getImageData(0, 0, this.width, this.height)
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.canvas.setAttribute('height', 200 + (deep - 1) * 20)
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(0, 155, 200, this.height - 155)
      this.ctx.font = '14px sans-serif'
      this.ctx.fillStyle = 'black'
      this.ctx.putImageData(store, 0, 0)
    }
  }

  loadImage (url) {
    return new Promise ((resolve, reject) => {
      const img = document.createElement('img')
      img.src = url
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        resolve(img)
      }
      img.onerror = (err) => {
        reject(err)
      }
    })
  }

  drawImage (img) {
    const sWidth = img.width
    const sHeight = img.height
    const scale = Number(parseInt((200 / sWidth) * 10000, 10) / 10000)
    this.ctx.drawImage(
      img,
      0, 0, sWidth, sHeight,
      0, 0, 200, sHeight * scale
    )
  }
}