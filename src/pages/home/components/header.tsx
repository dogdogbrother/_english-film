import loginStore from '@/store/login'
import { observer } from "mobx-react-lite"

const Header = observer(() => {
  const { setVisible, username } = loginStore
  function test() {
    setVisible(true)
  }
  return <div css={{
    padding: '20px'
  }}>
    <div css={{cursor: 'pointer'}} onClick={test}>{username || '登录'}</div>
  </div>
})
export default Header