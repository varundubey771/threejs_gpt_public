import { useState } from 'react'
import Canvas from './canvas'
import Customizer from './pages/Customizer'
import Home from './pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
 <main className='app transition-all ease-in'>
   <Home></Home>
<Canvas></Canvas>
 <Customizer></Customizer>
 </main>
  )
}

export default App
