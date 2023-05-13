import { useGetFetch } from './fetch'

export function getWordTranslate(word: string) {
  return useGetFetch({
    url: `/api/word/translate/${word}`
  })
}