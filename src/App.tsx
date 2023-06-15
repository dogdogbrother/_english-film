import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import PlayVideo from './pages/play-video'
import {Modal, Input, Button } from '@geist-ui/core'
import { useState } from 'react'
import { observer } from "mobx-react-lite"
import loginStore from './store/login'
import toastStore from './store/toast'
import translateModal from './store/translate-modal'
import { ToastContainer, toast } from 'react-toastify';
interface InputProp {
  value: string
  type?: 'error'
}
const App = observer(() => {
  const {visible, setVisible, login, loading } = loginStore
  const { Modal: TranslateModal, visible: _translateModalVisible, loading: _loading } = translateModal

  const { binds } = toastStore
  const [username, setUsername] = useState<InputProp>({
    value: '',
    type: undefined,
  })
  const [password, setPassword] = useState<InputProp>({
    value: '',
    type: undefined,
  })
  function handleLogin() {
    if (username.value.length < 4) {
      setUsername({...username, type: 'error'})
    }
    if (password.value.length < 4) {
      setPassword({...password, type: 'error'})
    }
    if (username.value.length < 4 || password.value.length < 4) {
      toast.error('用户名或密码长度不能小于4个字符')
    }
    login({username: username.value, password: password.value})
  }
  function inputUsername(e: any) {
    setUsername({...username, value: e.target.value, type: e.target.value.length < 4 ? 'error' : undefined})
  }
  function inputPassword(e: any) {
    setPassword({...password, value: e.target.value, type: e.target.value.length < 4 ? 'error' : undefined})
  }
  return (
    <div className="App">
      <ToastContainer {...binds} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/play-video/:fragmentId" element={<PlayVideo />}></Route>
        </Routes>
      </BrowserRouter>
      <Modal wrapClassName="login-dialog" visible={visible} onClose={() => setVisible(false)}>
        <div css={{width: '200px', margin: '0 auto', padding: '20px 0'}}>
          <Input width="100%" type={username.type} placeholder='请输入用户名' css={{marginBottom: '20px', display: 'block'}} onChange={inputUsername} />
          <Input.Password  type={username.type} placeholder='请输入密码' css={{marginBottom: '10px'}} onChange={inputPassword} />
          <p css={{fontSize: '12px', color: '#888', marginBottom: '10px'}}>初次登录即为注册</p>
          <Button loading={loading} type="secondary" ghost width="100%" onClick={handleLogin}>登录</Button>
        </div>
      </Modal>
      <TranslateModal />
    </div>
  )
}) 

export default  App
