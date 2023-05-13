import { usePostFetch, useGetFetch } from './fetch'

interface LoginProp {
  username: string
  password: string
}
export function login(data: LoginProp) {
  return usePostFetch({
    url: '/api/user/login',
    data
  })
}

export function getInfo() {
  return useGetFetch({
    url: '/api/user/info',
  })
}