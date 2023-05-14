import { useState } from "react"
import { Loading } from '@geist-ui/core'
import { VolumeNotice, Star } from '@icon-park/react'
import { getWordTranslate, addCollect } from '@/api/word'

export default function TranslateCard() {
  return <div>123</div>
}

/**
 * 传入单词,内部处理接口和loading
 */
export function useTranslate(playState: boolean) {
  const [loading, setLoading] = useState(false)
  const [translateRes, setTranslateRes] = useState<any>()
  const [word, setWord] = useState<string | undefined>()  // 本来的word
  function fetchTranslate(_word: string) {
    if (!playState) {
      setWord(_word)
      setLoading(true)
      getWordTranslate(_word).then(res => {
        const { explains, web, ...data } = res
        setTranslateRes({
          explains,
          web,
          ...data
        })
      }).finally(() => setLoading(false))
    }
  }
  // 发音
  function playPhonetic(speech: string) {
    const audio = new Audio(speech)
    audio.play()
  }
  function oncollect() {
    addCollect({
      word: word as string,
      filmId: '1', // 虚假的电影id
      keyWord: translateRes.word
    }).then(res => console.log(res))
    // word
    // translateRes.word
  }
  function contentCard() {
    return <div css={{
      padding: '5px 15px',
      backgroundColor: '#fff',
      width: '340px'
    }}>
      {
        loading
        ?
        <Loading>翻译中</Loading>
        :
        <div>
          <div css={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: '10px'
          }}>
            <h4 css={{fontSize: '20px'}}>{translateRes.word}</h4>
            {/* filled */}
            <Star onClick={oncollect} css={{cursor: 'pointer', transform: 'translateY(2px)'}} theme="outline" size="24" fill="#333" strokeWidth={2}/>
          </div>
          <div css={{
            display: "flex",
            alignItems: "center"
          }}>
            {
              translateRes.ukPhonetic && (<div css={{
                display: "flex",
                alignItems: "center",
                marginRight: '10px',
                '> *': {
                  marginRight: '5px'
                }
              }}>
                <span>英</span>
                <span>/{translateRes.ukPhonetic}/</span>
                <VolumeNotice  onClick={() => playPhonetic(translateRes.ukSpeech)} css={{cursor: 'pointer', transform: 'translateY(3px)'}} theme="outline" size="20" fill="#333" strokeWidth={2}/>
              </div>)
            }
            
            <div css={{
              display: "flex",
              alignItems: "center",
              '> *': {
                marginRight: '5px'
              }
            }}>
              <span>美</span>
              <span>/{translateRes.usPhonetic}/</span>
              <VolumeNotice onClick={() => playPhonetic(translateRes.usSpeech)} css={{cursor: 'pointer', transform: 'translateY(3px)'}} theme="outline" size="20" fill="#333" strokeWidth={2}/>
            </div>
          </div>
        </div>
      }
    </div>
  }
  return {
    ContentCard: contentCard,
    fetchTranslate
  }
}