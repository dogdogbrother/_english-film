import { useState } from "react"
import { Loading } from '@geist-ui/core'

export default function TranslateCard() {
  return <div>123</div>
}

/**
 * 传入单词,内部处理接口和loading
 */
export function useTranslate() {
  const [loading, setLoading] = useState(false)
  const [ translateRes, setTranslateRes ] = useState('')
  function getTranslate(word: string) {

  }
  function contentCard() {
    return <div css={{
      padding: '20px',
      backgroundColor: '#fff',
      width: '300px'
    }}>
      {
        !loading
        ?
        <Loading>翻译中</Loading>
        :
        <div>123</div>
      }
    </div>
  }
  return {
    ContentCard: contentCard,
    getTranslate
  }
}