import { makeObservable, observable, action, runInAction } from "mobx"
import { toast } from 'react-toastify'
import { Modal, Loading } from '@geist-ui/core'
import { getWordTranslate, addCollect } from '@/api/word'
import { VolumeNotice, Star } from '@icon-park/react'

interface translateProp {
  translation: string
  speakUrl: string
  ukPhonetic: string
  ukSpeech: string
  usPhonetic: string
  usSpeech: string
  word: string
  isWord: boolean
  explains: string[]
}
class TranslateModalStore {
  visible = false
  loading = false
  translate: translateProp = {
    translation: '',
    speakUrl: '',
    ukPhonetic: '',
    ukSpeech: '',
    usPhonetic: '',
    usSpeech: '',
    word: '',
    isWord: false,
    explains: []
  }
  Modal = () => <Modal visible={this.visible} onClose={this.close} width='600px'>
    {
      this.loading
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
          <h4 css={{fontSize: '22px'}}>{this.translate.word}</h4>
          <Star 
            onClick={() => onCollect(this.translate)} 
            css={{
              cursor: 'pointer', 
              transform: 'translateY(2px) scale(1)',
              transition: '0.2s',
              color: 'red',
              '&:hover': {
                transform: 'translateY(2px) scale(1.3)',
              }
            }} 
            theme="outline" 
            size="24" 
            fill="#333" 
            strokeWidth={2}
          />
        </div>
        <div css={{
          display: "flex",
          alignItems: "center",
          marginBottom: '20px'
        }}>
          {
            this.translate.ukPhonetic && (<div css={{
              display: "flex",
              alignItems: "center",
              marginRight: '10px',
              '> *': {
                marginRight: '5px'
              }
            }}>
              <span>英</span>
              <span>/{this.translate.ukPhonetic}/</span>
              <VolumeNotice onClick={() => playPhonetic(this.translate.ukSpeech)} css={{cursor: 'pointer', transform: 'translateY(3px)'}} theme="outline" size="20" fill="#333" strokeWidth={2}/>
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
            <span>/{this.translate.usPhonetic}/</span>
            <VolumeNotice onClick={() => playPhonetic(this.translate.usSpeech)} css={{cursor: 'pointer', transform: 'translateY(3px)'}} theme="outline" size="20" fill="#333" strokeWidth={2}/>
          </div>
        </div>
        <ul css={{
          display: 'flex',
          alignItems: 'start',
          flexDirection: 'column',
          textAlign: 'left'
        }}>
          { this.translate.explains.map((translate, index) => <li key={index} css={{padding: '5px 0', fontSize: '14px'}}>{ translate }</li>) }
        </ul>
      </div>
    }
  </Modal>
  constructor() {
    makeObservable(this, {
      visible: observable,
      loading: observable,
      Modal: observable,
      setVisible: action,
      close: action
    })
  }
  setVisible = async (word: string) => {
    this.visible = true
    this.loading = true
    const res = await getWordTranslate(word)
    runInAction(() => {
      this.translate = res
      this.loading = false
    })
  }
  close = () => {
    this.visible = false
    // setTimeout(() => {
    //   // 清除数据
    // }, 300)
  }
}

export default new TranslateModalStore()

function onCollect(translate: translateProp) {
  const { word } = translate
  toast.success('收藏成功')
  // addCollect({
  //   word,
  //   filmId: '1', // 虚假的电影id
  // }).then(() => {
  //   toast.success('收藏成功')
  // })
}

// 发音
function playPhonetic(speech: string) {
  const audio = new Audio(speech)
  audio.play()
}