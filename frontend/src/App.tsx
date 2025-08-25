import { useState,useRef} from 'react'
import {Leaderboard} from '../components/Leaderboard.tsx'
import SearchBar from '../components/SearchBar.tsx'
import { Map, type AddMapMarker }from '../components/Map.tsx'

import './App.css'

function App() {
  const [addy,setAddy] = useState<string>("")
  const mapRef = useRef<AddMapMarker>(null)
  return (
    <>

      <div id='Enter your building' className='enter-building'>
        <div>Building Electricity Efficiency Checker</div>
        <h3 style={{fontSize:"1.1rem",marginTop:"0.5vh ",fontWeight:"normal"}}>How does your building pair up?</h3>
        <span style={{zIndex:3}}><SearchBar userInput={addy} onChange={setAddy}/></span>
        <Map ref={mapRef}/>
        <Leaderboard/>
      </div>

      
    </>
  )
}

export default App
