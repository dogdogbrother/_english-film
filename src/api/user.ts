import { usePostFetch } from './fetch'

export function login(data: any) {
  return usePostFetch({
    url: '/api/user/login',
    data
  })
}