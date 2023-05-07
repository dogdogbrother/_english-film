import { useState } from "react"
import { Loading } from '@geist-ui/core'
import { VolumeNotice, Star } from '@icon-park/react'

export default function TranslateCard() {
  return <div>123</div>
}

/**
 * 传入单词,内部处理接口和loading
 */
export function useTranslate(playState: boolean) {
  const [loading, setLoading] = useState(false)
  const [ translateRes, setTranslateRes ] = useState<any>()
  function fetchTranslate(word: string) {
    if (!playState) {
      setLoading(true)
      fetch(`/api/word/translate/${word}`).then(res => res.json()).then(res => {
        console.log(res);
        const { explains, web, ...data } = res.data
        setTranslateRes({
          explains: JSON.parse(explains),
          web: JSON.parse(web),
          ...data
        })
        console.log({
          explains: JSON.parse(explains),
          web: JSON.parse(web),
          ...data
        });
        
      }).finally(() => {
        setLoading(false)
      })
    }
  }
  // 发音
  function playPhonetic(speech: string) {
    
  }
  function contentCard() {
    return <div css={{
      padding: '5px 20px',
      backgroundColor: '#fff',
      width: '300px'
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
            alignItems: "center"
          }}>
            <h4 css={{fontSize: '20px'}}>{translateRes.word}</h4>
            <Star css={{cursor: 'pointer'}} theme="outline" size="24" fill="#333" strokeWidth={2}/>
          </div>
          <div css={{
            display: "flex",
            alignItems: "center"
          }}>
            <div css={{
              display: "flex",
              alignItems: "center",
              marginRight: '10px',
              '> *': {
                marginRight: '5px'
              }
            }}>
              <span>英</span>
              <span>/{translateRes.ukPhonetic}/</span>
              <VolumeNotice onClick={() => playPhonetic(translateRes.ukSpeech)} css={{cursor: 'pointer'}} theme="outline" size="20" fill="#333" strokeWidth={2}/>
            </div>
            <div css={{
              display: "flex",
              alignItems: "center",
              '> *': {
                marginRight: '5px'
              }
            }}>
              <span>美</span>
              <span>/{translateRes.usPhonetic}/</span>
              <VolumeNotice onClick={() => playPhonetic(translateRes.usSpeech)} css={{cursor: 'pointer'}} theme="outline" size="20" fill="#333" strokeWidth={2}/>
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