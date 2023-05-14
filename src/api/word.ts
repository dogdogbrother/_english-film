import { useGetFetch, usePostFetch } from './fetch'

export function getWordTranslate(word: string) {
  return useGetFetch({
    url: `/api/word/translate/${word}`
  })
}

interface AddCollectProp {
  word: string
  filmId: string
  keyWord: string
}
export function addCollect(data: AddCollectProp) {
  return usePostFetch({
    url: `/api/word/collect`,
    data
  })
}