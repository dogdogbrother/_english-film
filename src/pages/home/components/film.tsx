import { Image, Drawer } from '@geist-ui/core'
import { useState, useRef, useEffect } from 'react'
// import videojs from 'video.js'
// import zhLang from 'video.js/dist/lang/zh-CN.json'
import Player from 'video.js/dist/types/player'
import { useNavigate } from 'react-router-dom'
import { getFilmList, getFragmentList } from '@/api/films'
import type { FilmProp, FragmentProp } from '@/api/films'
import loginStore from '@/store/login'

// videojs.addLanguage('zh-CN', zhLang)

export default function Film() {
  useEffect(() => {
    getFilmList().then((res) => {
      setFilmList(res!)
    })
  }, [])
  const { collectList } = loginStore
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
          <h3 css={{textAlign: 'center'}}>{film.filmName}</h3>
          <p>在这里你收藏了{collectList.filter(collect => collect.filmId === film.id).length}个单词</p>
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
