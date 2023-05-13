import { makeObservable, observable, action } from "mobx"
import { login, getInfo } from '@/api/user'

class LoginStore {
  visible = false
  loading = false
  username: string | undefined = undefined
  constructor() {
    if (!this.username) {
      this.getInfo()
    }
    makeObservable(this, {
      visible: observable,
      loading: observable,
      username: observable,
      setVisible: action,
      setLoading: action,
      login: action,
      getInfo: action
    })
  }
  setVisible = (state: boolean) => {
    this.visible = state
  }
  setLoading = (state: boolean) => {
    this.loading = state
  }
  setUsername = (username: string) => {
    this.username = username
  }
  login = (form: Parameters<typeof login>[0]) => {
    this.setLoading(true)
    login(form).then(res => {
      const { token, username } = res
      localStorage.setItem("token", token),
      this.setUsername(username)
      this.setVisible(false)
    }).finally(() => this.setLoading(false))
  }
  getInfo = () => {
    getInfo().then(res => {
      console.log(res);
    })
  }
}

export default new LoginStore()