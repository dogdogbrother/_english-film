import { useModal, Modal, Input, Button, useToasts } from '@geist-ui/core'
import { useState } from 'react'
import { login } from '../api/user'

interface InputProp {
  value: string
  type?: 'error'
}

export function useLogin() {
  const { setToast } = useToasts()
  const { visible, setVisible, bindings } = useModal()
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
      return setToast({
        text: '用户名或密码长度不能小于4个字符',
        type: 'error',
      })
    }
    login({username: username.value, password: password.value}).then(res => {
      console.log(res)
      const { token } = res
      localStorage.setItem("token", token)
    })
  }
  const [loading, setLoading] = useState(false)
  function inputUsername(e: any) {
    setUsername({...username, value: e.target.value, type: e.target.value.length < 4 ? 'error' : undefined})
  }
  function inputPassword(e: any) {
    setPassword({...password, value: e.target.value, type: e.target.value.length < 4 ? 'error' : undefined})
  }
  const LoginModal = <Modal wrapClassName="login-dialog" {...bindings}>
    <div css={{width: '200px', margin: '0 auto'}}>
      <Input width="100%" type={username.type} placeholder='请输入用户名' css={{marginBottom: '20px', display: 'block'}} onChange={inputUsername} />
      <Input.Password  type={username.type} placeholder='请输入密码' css={{marginBottom: '10px'}} onChange={inputPassword} />
      <p css={{fontSize: '12px', color: '#888', marginBottom: '10px'}}>初次登录即为注册</p>
      <Button type="secondary" ghost width="100%" onClick={handleLogin}>登录</Button>
    </div>
  </Modal>

}