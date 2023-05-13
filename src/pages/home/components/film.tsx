import { Image, Drawer } from '@geist-ui/core'
import { useState, useRef } from 'react'
import videojs from 'video.js'
import zhLang from 'video.js/dist/lang/zh-CN.json'
import Player from 'video.js/dist/types/player'
import { useNavigate } from 'react-router-dom'

videojs.addLanguage('zh-CN', zhLang)

export default function Film() {
  const [drawerState, setDrawerState] = useState(false)
  const player = useRef<Player>()
  const navigate = useNavigate()
  function openDrawer() {
    setDrawerState(true)
    if (player.current) return
    setTimeout(() => {
      player.current = videojs('video-1', {
        autoPlay: true,
        controlBar: { children: [] },
        techOrder: ['html5'],
        width: 280,
        sources: [
          {src: '/TheTrumanShow/index.m3u8'}
        ]
      })
    }, 500)
  }
  function closeDrawer() {
    setDrawerState(false)
  }
  function toPlayVideo() {
    navigate('/play-video')

  }
  return <div>
    <ul css={{
      display: 'flex',
      flexWrap: 'wrap'
    }}>
      <li onClick={openDrawer} css={{cursor: 'pointer'}}>
        <Image src='/TheTrumanShow/index.png' />
        <h3>楚门的世界 TheTrumanShow</h3>
        <p>280短句 4700个单词</p>
      </li>
    </ul>
    <Drawer visible={drawerState} onClose={closeDrawer}>
      <ul>
        <li onClick={toPlayVideo} css={{ cursor: 'pointer', 'video': {width: '280px'}}}>
          <video id='video-1' object-fit='cover' />
          <h4>01 楚门的世界 TheTrumanShow</h4>
          <p>82短句 440个单词</p>
        </li>
      </ul>
    </Drawer>
  </div>
}

function ref(arg0: never[]) {
  throw new Error('Function not implemented.')
}
