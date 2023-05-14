import type { Theme, ToastPosition } from "react-toastify"

// 获取当前是否为白天  6点到18点算白天
function getLightDay() {
  const now = new Date()
  const hour = now.getHours()
  return hour > 6 && hour < 18
}
class ToastStore {
  position: ToastPosition
  theme: Theme
  pauseOnHover: boolean
  binds: { position: ToastPosition, theme: Theme, pauseOnHover: boolean }
  constructor() {
    this.position = 'top-center'
    this.theme = getLightDay() ? 'light' : 'dark'
    this.pauseOnHover = false
    this.binds = { position: this.position, theme: this.theme, pauseOnHover: this.pauseOnHover }
  }
}

export default new ToastStore()