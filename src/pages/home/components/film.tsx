import { Image, Drawer } from '@geist-ui/core'
import { useState, useRef, useEffect } from 'react'
// import videojs from 'video.js'
// import zhLang from 'video.js/dist/lang/zh-CN.json'
import Player from 'video.js/dist/types/player'
import { useNavigate } from 'react-router-dom'
import { getFilmList, getFragmentList } from '@/api/films'
import type { FilmProp, FragmentProp } from '@/api/films'
// videojs.addLanguage('zh-CN', zhLang)

export default function Film() {
  useEffect(() => {
    getFilmList().then((res) => {
      console.log(res);
      setFilmList(res!)
    })
  }, [])
  const [drawerState, setDrawerState] = useState(false)
  const [filmList, setFilmList] = useState<FilmProp[]>([])
  const [fragmentList, setFragmentList] = useState<FragmentProp[]>([])
  const player = useRef<Player>()
  const navigate = useNavigate()
  function openDrawer(filmId: string) {
    getFragmentList(filmId).then(res => {
      setFragmentList(res!)
    })
    setDrawerState(true)
    // if (player.current) return
    // setTimeout(() => {
    //   // player.current = videojs('video-1', {
    //   //   autoPlay: true,
    //   //   controlBar: { children: [] },
    //   //   techOrder: ['html5'],
    //   //   width: 280,
    //   //   sources: [
    //   //     {src: '/TheTrumanShow/index.m3u8'}
    //   //   ]
    //   // })
    // }, 500)
  }
  function closeDrawer() {
    setDrawerState(false)
  }
  function toPlayVideo(fragmentId: string) {
    navigate(`/play-video/${fragmentId}`)
  }
  return <div>
    <ul css={{
      display: 'flex',
      flexWrap: 'wrap'
    }}>
      {
        filmList.map(film => <li key={film.id} onClick={() => openDrawer(film.id)} css={{cursor: 'pointer'}}>
          <Image width='200px' height='200px' src={film.filmCover} />
          <h3>{film.filmName}</h3>
        </li>)
      }
    </ul>
    <Drawer visible={drawerState} onClose={closeDrawer}>
      <ul css={{minWidth: '300px'}}>
        {
          fragmentList.map((fragment, index) => <li onClick={() => toPlayVideo(fragment.id)} key={fragment.id} css={{ cursor: 'pointer', margin: '10px 0' }}>
            <h4>第{ index + 1 }段</h4>
          </li>)
        }
      </ul>
    </Drawer>
  </div>
}
