import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Details } from './pages/Details'
import Checkout from './pages/Checkout'
import Result from './pages/Result'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element={<Home/>}/>
      <Route path = "/experience/:id" element={<Details/>}/>
      <Route path = "/checkout" element={<Checkout/>}/>
      <Route path="/result"  element={<Result/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
