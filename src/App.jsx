import 'antd/dist/reset.css';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import hacker from './assets/hacker.png'
import './App.css'

import Chatbot from './Components/Chatbot';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://www.flaticon.com/free-icons/cyber-attack" title="cyber attack icons"></a> 
           <img src={hacker} className="logo react" alt="React logo" />

      </div>
      <h1>Welcome to CyberGPT</h1>
     
      <Chatbot/>
    </>
  )
}

export default App
