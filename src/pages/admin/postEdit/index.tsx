import Markdown from '@/components/Admin/Markdown'
import Toolbar, { MenuItem } from '@/components/Toolbar'
import ExtendComponent from '@/core/component'
import { CategoryModel } from '@/models/category'
import { UpdatePostModel } from '@/models/post'
import { Button, Icon, message, Tag } from 'antd'
import defaulsDeep from 'lodash/defaultsDeep'
import isEqual from 'lodash/isEqual'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { PostEditStyle } from './style'

export interface Params {
  pid: string
}

interface PostEditState {
  menu: MenuItem[]
  markdownValue: string
  markdownHeight: number
  toolbar: { [T in any]: any }
  submitting: boolean
  disabled: boolean
  tags: string[]
  postLoading: boolean
  categoryList: CategoryModel[]
  fullscreen: boolean
}

const defaultMenu: MenuItem[] = [
  {
    type: 'input',
    key: 'title',
    name: '标题',
    width: 300
  },
  {
    type: 'select',
    key: 'categories',
    name: '分类',
    mode: 'multiple',
    optionList: []
  },
  {
    type: 'input',
    key: 'tag',
    name: '标签'
  }
]

export const tagsColorList = [
  'geekblue',
  'red',
  'purple',
  'cyan',
  'green',
  'orange',
  'gold',
  'lime',
  'magenta',
  'blue',
  'volcano'
]

export default class PostEdit extends ExtendComponent<
  RouteComponentProps<Params>,
  PostEditState
> {
  private postEditorRef: React.RefObject<HTMLDivElement> = React.createRef()
  private originMarkdownHeigt: number = 600
  private screenHeight: number = 0
  private prevHeight: number = 0

  public constructor (props) {
    super(props)
    const menu = defaulsDeep([], defaultMenu)
    menu[2].addonAfter = (
      <Icon
        type="plus"
        style={{ cursor: 'pointer' }}
        onClick={() => this.handleAddTag()}
      />
    )
    this.state = {
      menu,
      markdownHeight: 0,
      toolbar: this.setInitialToolbarOfState(menu),
      submitting: false,
      disabled: true,
      markdownValue: '',
      tags: [],
      postLoading: true,
      categoryList: [],
      fullscreen: false
    }
  }

  private get pid () {
    return this.props.match.params.pid
  }

  private get mode () {
    return this.pid ? 'edit' : 'add'
  }

  public async componentDidMount () {
    this.screenHeight = window.screen.availHeight
    this.getCategoryList()
    this.setMarkdownHeight()
    if (this.pid) {
      const { data } = await this.$models.post.fetchPost(this.pid)
      const { post } = data
      this.setState({
        toolbar: {
          title: post.title,
          categories: post.categories.map(({ id }) => id)
        },
        tags: post.tags,
        markdownValue: post.content,
        postLoading: false
      })
    } else {
      this.setState({
        postLoading: false
      })
    }
  }

  public componentDidUpdate (prevProps, prevState: PostEditState) {
    if (
      !isEqual(prevState.toolbar, this.state.toolbar) ||
      this.state.markdownValue !== prevState.markdownValue
    ) {
      this.setState({
        disabled: !(
          Object.entries(this.state.toolbar)
            .filter(([key]) => key !== 'tags')
            .every(([, val]) => val) && Boolean(this.state.markdownValue)
        )
      })
    }
  }

  public render () {
    const { tags } = this.state
    return (
      <PostEditStyle className="post-editor"
        ref={this.postEditorRef}>
        <Toolbar
          menu={this.state.menu}
          onChange={(key: string, value) =>
            this.handleToolbarChange(key, value)
          }
          toolbar={this.state.toolbar}
        />
        {tags.length ? (
          <div className="tags">
            {tags.map((tag, index) => (
              <Tag
                closable={true}
                key={index}
                color={tagsColorList[index]}
                onClose={() => this.handleCloseTag(index)}
              >
                {tag}
              </Tag>
            ))}
          </div>
        ) : null}
        <div
          className={`markdown-wrap ${this.state.fullscreen &&
            'fullscreen-controller'}`}
        >
          <Markdown
            pid={this.pid}
            height={this.state.markdownHeight}
            value={this.state.markdownValue}
            loading={this.state.postLoading}
            onChange={(value) => this.handleMarkdownChange(value)}
          />
          <Button
            className="submit"
            type="primary"
            disabled={this.state.disabled}
            loading={this.state.submitting}
            onClick={() => this.handleSubmit()}
          >
            {this.mode === 'edit' ? '修改' : '提交'}
          </Button>
          <Icon
            className="fullscreen-controller"
            type={this.state.fullscreen ? 'fullscreen-exit' : 'fullscreen'}
            onClick={() => this.handleFullscreen()}
          />
        </div>
      </PostEditStyle>
    )
  }

  private handleFullscreen () {
    this.setState(
      {
        fullscreen: !this.state.fullscreen
      },
      () => {
        if (this.state.fullscreen) {
          this.setState({
            markdownHeight: this.screenHeight
          })
        } else {
          this.setState({
            markdownHeight: this.prevHeight
          })
        }
      }
    )
  }

  private setInitialToolbarOfState (menu: MenuItem[]) {
    const map: any = {}
    menu.forEach((menuItem) => {
      map[menuItem.key] = menuItem.defaultValue
    })
    return map
  }

  private handleToolbarChange (key, value) {
    this.setState({
      toolbar: {
        ...this.state.toolbar,
        [key]: value
      }
    })
  }

  private async getCategoryList () {
    const { data } = await this.$models.category.getList()
    const menu = defaulsDeep([], this.state.menu)
    menu[1].optionList = data.list.map(({ id, name }) => ({
      value: id,
      label: name
    }))
    this.setState({
      menu
    })
  }

  private handleMarkdownChange (value) {
    this.setState({
      markdownValue: value
    })
  }

  private setMarkdownHeight () {
    if (this.postEditorRef.current) {
      let { height } = this.postEditorRef.current.getBoundingClientRect()
      height = ~~(height - 24 * 2 - 32 - 16)
      this.originMarkdownHeigt = height
      this.prevHeight = this.originMarkdownHeigt
      if (this.state.tags.length) {
        this.prevHeight = this.originMarkdownHeigt - 16 - 22
      }
      this.setState({
        markdownHeight: this.prevHeight
      })
    }
  }

  private async handleSubmit () {
    this.setState({
      submitting: true
    })
    try {
      const model: UpdatePostModel = {
        title: this.state.toolbar.title,
        categories: this.state.toolbar.categories,
        content: this.state.markdownValue,
        summary: this.state.markdownValue.split('<!-- more -->')[0] || '',
        tags: this.state.tags
      }
      if (this.mode === 'add') {
        await this.$models.post.addPost(model)
      } else {
        model.id = this.pid
        await this.$models.post.updatePost(model)
      }
      this.finish()
    } catch (err) {
      throw err
    } finally {
      this.setState({
        submitting: false
      })
    }
  }

  private handleAddTag () {
    if (this.state.tags.length >= tagsColorList.length) {
      message.info(`最多添加${tagsColorList.length}个tag`)
      return
    }
    const tagSet = new Set(this.state.tags)
    tagSet.add(this.state.toolbar.tag)
    this.setState({
      tags: Array.from(tagSet)
    })
    if (this.originMarkdownHeigt === this.state.markdownHeight) {
      this.setState({
        markdownHeight: this.originMarkdownHeigt - 16 - 22
      })
    }
  }

  private handleCloseTag (index: number) {
    const tags = [...this.state.tags]
    tags.splice(index, 1)
    if (!tags.length) {
      this.setState({
        markdownHeight: this.originMarkdownHeigt
      })
    }
    this.setState({
      tags
    })
  }

  private finish () {
    const successText = this.mode === 'edit' ? '修改' : '新增' + '文章成功！'
    message.success(successText)
    setTimeout(() => {
      this.props.history.push(`/admin/post/list`)
    })
  }
}
