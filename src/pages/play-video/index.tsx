import { useEffect, useState, useReducer } from 'react'
import videojs from 'video.js'
import zhLang from 'video.js/dist/lang/zh-CN.json'
import { Play } from '@icon-park/react'
import { caption } from '../../../public/TheTrumanShow/caption'
import { Select, Popover } from '@geist-ui/core'
import Player from 'video.js/dist/types/player'
import { useTranslate } from './components/translate-card'

videojs.addLanguage('zh-CN', zhLang)

export default function PlayVideo() {
  const [ playState, setPlayState ] = useState(false)
  const [ player, setPlayer ] = useState<Player | undefined>()
  const [ currentTime, setCurrentTime ] = useState(0)
  const [ duration, setDuration ] = useState(0)
  const [ controlPanel, setControlPanel ] = useState({
    captionType: '1', // 1 中英 2英 3无字幕
    playbackRate: '1', // 倍速播放 0.25 0.5 0.75 1 1.25 1.5
    captionSize: '1', // 字幕大小 0.5 1 1.5 
  })
  const { ContentCard, fetchTranslate } = useTranslate(playState)
  interface CaptionProp {
    origin: string
    translate: string
    originList: string[]
    popVisibleList: boolean[]
  }
  const [ currentCaption, setCurrentCaption ] = useState<CaptionProp>()

  interface WindowSizeProp {
    viodeHeight?: number
    viodeWidth?: number
    vertical?: boolean // 上下有黑边
    horizontal?: boolean // 左右有黑边
    y?: number // 上黑边的高度
    x?: number // 左黑边的宽度
    vWidth?: number // 视频的真正宽度
  }
  // 根据视频的宽高比和
  const [windowSize, setWindowSize] = useReducer((state: WindowSizeProp, action: WindowSizeProp ): WindowSizeProp => {
    const sizeRes = {...state, ...(action || {}) }
    const { viodeHeight, viodeWidth } = sizeRes
    const { innerWidth, innerHeight } = window
    // 视频的宽高比
    const viodeAspectRatio = viodeWidth! / viodeHeight!
    // 屏幕的宽高比
    const windowAspectRatio = innerWidth / innerHeight
    // 代表上下有黑边
    if (viodeAspectRatio > windowAspectRatio) {
      sizeRes.vertical = true
      sizeRes.horizontal = false
      // 视频的真实高度
      const vHeight = innerWidth / viodeWidth! * viodeHeight!
      sizeRes.y = (innerHeight - vHeight) / 2
      sizeRes.x = 0
      sizeRes.vWidth = innerWidth
    }
    
    // 代表左右有黑边
    if (viodeAspectRatio < windowAspectRatio) {
      sizeRes.horizontal = true
      sizeRes.vertical = false
      const vWidth = innerHeight / viodeHeight! * viodeWidth!
      // 视频的真实宽度
      sizeRes.vWidth = vWidth
      sizeRes.x = (innerWidth - vWidth) / 2
      sizeRes.y = 0
    }
    return sizeRes
  }, {})
  useEffect(() => {
    const _player: Player = videojs('video-play', {
      autoPlay: true,
      controlBar: { children: [] },
      techOrder: ['html5'],
      sources: [
        {src: '/TheTrumanShow/index.m3u8'}
      ]
    })
    setPlayer(_player)
    window.addEventListener('resize', resizeUpdate);
    return () => {
      _player.dispose();
      window.removeEventListener('resize', resizeUpdate);
      window.removeEventListener('keydown', keydown);
    }
  }, [])
  useEffect(() => {
    if (currentTime !== 0) {
      getEngSubtitle(currentTime)
    }
  }, [currentTime])
  

  useEffect(() => {
    if (!player) return
    registerVideoEvent(player)
  }, [player])
  useEffect(() => {
    window.addEventListener('keydown', keydown);
    return () => {
      window.removeEventListener('keydown', keydown);
    }
  }, [player, playState])
  function keydown(e: any) {
    if (e.keyCode === 32) {
      if (playState) {
        player!.pause() 
      } else {
        player!.play()
      }
    }
  }
  function resizeUpdate() {
    setWindowSize({})
  }
  // 注册video事件
  function registerVideoEvent(_player: Player) {
    _player.on('play', () => {
      setPlayState(true)
    })
    _player.on('pause', () => {
      setPlayState(false)
    })
    _player.on('loadedmetadata', () => {
      // _height 和 _width 是视频的尺寸比例 和windows的窗口宽高算个比例出来
      const viodeHeight = _player.videoHeight()
      const viodeWidth = _player.videoWidth()
      setWindowSize({ viodeHeight, viodeWidth })
    })
    _player.on('timeupdate', (e: Event) => {
      const target =  e.target as any
      const { currentTime, duration: _duration  } = target.children[0] || {}
      setCurrentTime(currentTime)
      if (duration === 0) {
        setDuration(_duration)
      }
    })
  }
  function play(e: any) {
    e.stopPropagation()
    player!.play()
  }
  function pause() {
    player!.pause()
  }
  function getEngSubtitle(_currentTime: number) {
    const find = Object.entries(caption).find(([key]) => {
      const [ startTime, endTime ] = key.split('-')
      return Number(startTime) <= _currentTime && Number(endTime) >= _currentTime
    })
    if (find) {
      const [ _key, value ] = find
      const { origin, translate } = value
      const originList = origin.split(' ')
      const popVisibleList = originList.map(() => false)
      setCurrentCaption({
        origin,
        translate,
        originList,
        popVisibleList
      })
    } else setCurrentCaption(undefined)
  }
  function getEnglish() {
    if (currentCaption?.originList) {
      return currentCaption.originList.map((word, index) => 
        <Popover content={<ContentCard /> as any} visible={currentCaption.popVisibleList[index]} onVisibleChange={handlePop(index)} placement="top" key={index}>
          <span onClick={handleWord(word, index)}>{ word }</span>
        </Popover>
      )
    }
  }
  function getTranslate() {
    const find = Object.entries(caption).find(([key]) => {
      const [ startTime, endTime ] = key.split('-')
      return Number(startTime) <= currentTime && Number(endTime) >= currentTime
    })
    if (find) {
      const [ _key, value ] = find
      const { translate } = value
      return translate 
    }
    return null
  }
  const handlePop = (index: number) => (val: boolean) => {
    if (currentCaption?.popVisibleList) {
      const { popVisibleList } = currentCaption
      const _popVisibleList = popVisibleList
      _popVisibleList[index] = val
      setCurrentCaption({
        ...currentCaption,
        popVisibleList: _popVisibleList
      })
    }
  }
  // 点击英文字幕
  const handleWord = (word: string, index: number) => (e: any) => {
    e.stopPropagation()
    player!.pause()
    if (currentCaption?.popVisibleList) {
      setCurrentCaption({
        ...currentCaption,
        popVisibleList: currentCaption.popVisibleList.map((_, itemIndex) => itemIndex === index)
      })
      fetchTranslate(word)
    }
  }
  function handleCaptionType(captionType: string | string[]) {
    setControlPanel({
      ...controlPanel,
      captionType: captionType as string
    })
  }
  function handlePlaybackRates(playbackRate: string | string[]) {
    setControlPanel({
      ...controlPanel,
      playbackRate: playbackRate as string
    })
    player!.playbackRate(Number(playbackRate))
  }
  function handleCaptionSize(captionSize: string | string[]) {
    setControlPanel({
      ...controlPanel,
      captionSize: captionSize as string
    })
  }
  return (
    <div 
      css={{
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#000', 
        position: 'relative'
      }}
    >
      <div>
        <video 
          style={{width: '100vw', height: '100vh', border: 'none', verticalAlign: 'middle'}}
          object-fit='cover'
          id='video-play'
          playsInline
        ></video>
      </div>
      <div onClick={pause} css={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0, zIndex: 99 }}>
        { playState ? null : <Play onClick={play} theme="outline" css={{opacity: 0.8, cursor: 'pointer'}} size="100" fill="#ddd" strokeWidth={2}/> }
      </div>
      <div css={{
        position: 'absolute', 
        zIndex: 100, 
        left: `${windowSize.x! + 20}px`, 
        right: `${windowSize.x! + 20}px`, 
        bottom: `${windowSize.y! + 25}px`,
      }}>
        {
          controlPanel.captionType !== '3'
          ?
          <div css={{
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            wordWrap: 'break-word',
            fontSize: `${windowSize.vWidth! / 30 * Number(controlPanel.captionSize)}px`,
            '> *': {
              marginRight: '1vw',
              cursor: 'pointer',
              textShadow: '2px 2px 5px #000',
              color: 'rgba(255, 255, 255, 0.85)', 
              transition: '0.3s',
              transform: 'scale(1)',
            },
            '> *:hover': {
              color: 'rgba(255, 255, 255, 1)', 
              transform: 'scale(1.08)'
            },
            '> *:last-child': {
              marginRight: 0
            },
          }}>{ getEnglish() }</div>
          :
          null
        }
        {
          controlPanel.captionType === '1'
          ?
          <p css={{
            fontSize: `${windowSize.vWidth! / 45 * Number(controlPanel.captionSize)}px`,
            color: '#fff',
            textAlign: 'center',
            paddingTop: '10px',
            textShadow: '2px 2px 5px #000',
          }}>{ getTranslate() }</p>
          :
          null
        }
      </div>
      <ul css={{
        position: 'absolute',
        zIndex: 100,
        opacity: 0.35,
        left: `${windowSize.x! + 20}px`, 
        top: `${windowSize.y! + 20}px`,
        display: 'flex',
        flexWrap: 'wrap',
        'li': {
          marginRight: '5px',
        },
        'li:last-child': {
          marginRight: 0
        }
      }}>
        <li>
          <Select value={controlPanel.captionType} onChange={handleCaptionType}>
            <Select.Option value="1">中英</Select.Option>
            <Select.Option value="2">英</Select.Option>
            <Select.Option value="3">无字幕</Select.Option>
          </Select >
        </li>
        <li>
          <Select value={controlPanel.playbackRate} onChange={handlePlaybackRates}>
            <Select.Option value="0.25">0.25倍速</Select.Option>
            <Select.Option value="0.5">0.5倍速</Select.Option>
            <Select.Option value="0.75">0.75倍速</Select.Option>
            <Select.Option value="1">1倍速</Select.Option>
            <Select.Option value="1.25">1.25倍速</Select.Option>
            <Select.Option value="1.5">1.5倍速</Select.Option>
          </Select >
        </li>
        <li>
          <Select value={controlPanel.captionSize} onChange={handleCaptionSize}>
            <Select.Option value="0.5">小字幕</Select.Option>
            <Select.Option value="1">适中字幕</Select.Option>
            <Select.Option value="1.5">大字幕</Select.Option>
          </Select >
        </li>
        <li>1</li>
      </ul>
    </div>
  )
}