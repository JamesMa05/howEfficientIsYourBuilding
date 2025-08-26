import { useState,useRef} from 'react'
import {Leaderboard} from '../components/Leaderboard.tsx'
import SearchBar from '../components/SearchBar.tsx'
import { Map, type AddMapMarker }from '../components/Map.tsx'

import './App.css'

function App() {

  const [addy,setAddy] = useState<{text:string; selected?:any}>({text:"",selected:null}) // state for SearchBar Component
  const [isClicked,setIsClicked] = useState<boolean | any>({
    click: false,
    name: "",
    score: null
  }) // function keeps track of whether a marker has been clicked + helps display info
  const markerRef = useRef<AddMapMarker>(null)
  const handleAddMarker = () =>{
    if(!markerRef.current) return
    markerRef.current.addLocation(addy.text,addy.selected.Latitude,addy.selected.Longitude,addy.selected.ENERGY_STAR_Score)
    setAddy({text:"",selected:null})
  }
  const handleRemoveMarker = () =>{
    if(!markerRef.current) return
    markerRef.current.removeLocation(isClicked.name)
  }
  return (
    <>

      <div id='Enter your building' className='enter-building' style={{display:'flex',flexDirection:'column',gap:"20px",alignItems:"center"}}>
        <button onClick={()=>window.open}>asdf</button>
        <div>Building Electricity Efficiency Checker</div>
        <h3 style={{fontSize:"1.1rem",marginTop:"0.5vh ",fontWeight:"normal"}}>How does your building pair up?</h3>
        <span style={{zIndex:3}}><SearchBar userInput={addy} onChange={setAddy} addMarker={handleAddMarker}/></span>
        {isClicked.click && 
          <div style={{
            border: "3px solid #384959",
            backgroundColor: "#BDDDFC",
            marginTop: 0,
            borderRadius: "0.3rem",
            padding: "1.5rem",
            fontSize: "1rem",
            width: "43vw",
            display:"flex",
            justifyContent:"space-between"
            }} >
            <div style={{fontSize:"1.2rem",fontFamily:"Permanent Marker"}}>{isClicked.name} </div>
            <div style={{fontSize:"1.2rem",fontFamily:"Permanent Marker"}}>{isClicked.score} 
              <span onClick={()=>{handleRemoveMarker();setIsClicked({click:false,name:"",score:null})}}style={{width:"30px",height:"20px",marginLeft:"10px",backgroundColor:"red",padding:"7px", borderRadius:"0.5rem",cursor:"pointer"}}>
                X
              </span>
            </div>
            
          </div>}
        <div style={{
          margin:"10px",
          height:"20vh",
          width:"45vw",
          position:"relative",
          zIndex:2
        }}><Map ref={markerRef} setIsClicked={setIsClicked}/></div>
        
        <div style={{
          marginTop:"25vh"
        }}><Leaderboard/></div>
      </div>

      
    </>
  )
}

export default App
