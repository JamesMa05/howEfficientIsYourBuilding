import { useState,useRef} from 'react'
import {Leaderboard} from '../components/Leaderboard.tsx'
import SearchBar from '../components/SearchBar.tsx'
import { Map, type AddMapMarker }from '../components/Map.tsx'

import './App.css'

function App() {

  const [addy,setAddy] = useState<{text:string; selected?:any}>({text:"",selected:null}) // state for SearchBar Component

  const markerRef = useRef<AddMapMarker>(null)
  const handleAddMarker = () =>{
    if(!markerRef.current) return
    markerRef.current.addLocation(addy.text,addy.selected.Latitude,addy.selected.Longitude)
  }
  return (
    <>

      <div id='Enter your building' className='enter-building' style={{display:'flex',flexDirection:'column',gap:"20px",alignItems:"center"}}>
        <div>Building Electricity Efficiency Checker</div>
        <h3 style={{fontSize:"1.1rem",marginTop:"0.5vh ",fontWeight:"normal"}}>How does your building pair up?</h3>
        <span style={{zIndex:3}}><SearchBar userInput={addy} onChange={setAddy} addMarker={handleAddMarker}/></span>
        <div style={{
          margin:"10px",
          height:"20vh",
          width:"45vw",
          position:"relative",
          zIndex:2
        }}><Map ref={markerRef}/></div>
        
        <div style={{
          marginTop:"20vh"
        }}><Leaderboard/></div>
      </div>

      
    </>
  )
}

export default App
