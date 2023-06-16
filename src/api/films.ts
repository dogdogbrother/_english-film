import { useGetFetch, usePostFetch } from './fetch'

export interface FilmProp {
  filmCover: string
  filmName: string
  id: string
}
export function getFilmList() {
  return useGetFetch<FilmProp[]>({
    url: `/api/film/list/`
  })
}

export interface FragmentProp {
  fragmentUrl: string
  filmId: string
  id: string
}
export function getFragmentList(filmId: string) {
  return useGetFetch<FragmentProp[]>({
    url: `/api/film/${filmId}/fragment/`
  })
}

export function getFragmentInfo(fragmentId: string) {
  return useGetFetch<FragmentProp>({
    url: `/api/film/fragment/${fragmentId}`
  })
}

export interface CaptionProp {
  start: number
  end: number
  cn: string
  en: string
}
export function getCaption(fragmentId: string) {
  return useGetFetch<CaptionProp[]>({
    url: `/api/film/${fragmentId}/caption`
  })
}