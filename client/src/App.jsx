import { useState } from 'react'
import './App.css'
import MainRouter from './services/Router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <MainRouter />
  )
}

export default App