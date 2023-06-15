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
export function getFragmentist(filmId: string) {
  return useGetFetch<FragmentProp[]>({
    url: `/api/film/${filmId}/fragment/`
  })
}