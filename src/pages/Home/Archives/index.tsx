import { ArchiveModel } from '@/models/archives'
import { Icon, Timeline } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { ArchivesStyle } from './style'

const ClockIcon = <Icon type="clock-circle-o" style={{ fontSize: '16px' }} />

import ExtendComponent from '@/core/component'

interface TimelineType {
  type: string
}

interface YearTimelineType extends TimelineType {
  type: 'year',
  value: number
}
interface ArchiveTimelineType extends TimelineType {
  type: 'archive',
  value: ArchiveModel
}

type ArchivesOfYear = Array<YearTimelineType | ArchiveTimelineType>

interface ArchivesState {
  archivesOfYear: ArchivesOfYear
  count: number
}

export default class Archives extends ExtendComponent<{}, ArchivesState> {
  constructor (props) {
    super(props)
    this.state = {
      count: 0,
      archivesOfYear: []
    }
  }

  public componentDidMount () {
    this.getTimeline()
  }

  public render () {
    const YearTimeline = (year) => (
      <div className="year">{ year }</div>
    )

    const ArchiveTimeline = ({ title, created, id }) => (
      <div className="archive">
        <span className="date">{ dayjs.unix(created).format('MM-DD') }</span>
        <span className="title" onClick={() => this.jumpToPost(id)}>{ title }</span>
      </div>
    )

    const Dot = (type: 'year' | 'archive', index: number) => {
      if (type === 'year') {
        if (index === 0) {
          return ClockIcon
        }
        return <Icon type="history" style={{
          fontSize: '16px'
        }} />
      }
      return null
    }

    return (
      <ArchivesStyle className="archives">
        <p className="count">目前共计 {this.state.count} 篇日志。 (゜-゜)つロ 干杯~</p>
        <Timeline className="timeline">
          {
            this.state.archivesOfYear.map(({ type, value }, index) => (
              <Timeline.Item key={ index } dot={ Dot(type, index) }>
                {
                  type === 'year' ? YearTimeline(value) : ArchiveTimeline(value as ArchiveModel)
                }
              </Timeline.Item>
            ))
          }
        </Timeline>,
      </ArchivesStyle>
    )
  }

  private jumpToPost (id) {
    this.push(`/post/${id}`)
  }

  private async getTimeline () {
    const { data: { archives } } = await this.$models.archives.getTimeline()
    const count: number = archives.length
    archives.sort((a, b) => b.created - a.created)
    const archivesOfYear: ArchivesOfYear = []
    const cache: Set<number> = new Set()
    archives.forEach((archive) => {
      const { created } = archive
      const year: number = dayjs.unix(created).year()
      if (!cache.has(year)) {
        cache.add(year)
        archivesOfYear.push({
          type: 'year',
          value: year
        })
        archivesOfYear.push({
          type: 'archive',
          value: archive
        })
      } else {
        archivesOfYear.push({
          type: 'archive',
          value: archive
        })
      }
    })
    this.setState({
      count,
      archivesOfYear
    })
  }
}
