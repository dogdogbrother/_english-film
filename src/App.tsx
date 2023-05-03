import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import PlayVideo from './pages/play-video'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/play-video" element={<PlayVideo />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
