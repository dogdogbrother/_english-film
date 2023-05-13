import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import { GeistProvider } from '@geist-ui/core'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <GeistProvider>
    <App />
  </GeistProvider>
)
