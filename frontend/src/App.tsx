import { useState,useRef} from 'react'
import {Leaderboard} from '../components/Leaderboard.tsx'
import SearchBar from '../components/SearchBar.tsx'
import { Map, type AddMapMarker }from '../components/Map.tsx'
import linkedinicon from './assets/linkedinicon.svg'
import './App.css'

function App() {

  const [addy,setAddy] = useState<{text:string; selected?:any}>({text:"",selected:null}) // state for SearchBar Component
  const [isClicked,setIsClicked] = useState<boolean | any>({
    click: false,
    name: "",
    score: null
  }) // function keeps track of whether a marker has been clicked + helps display info
  const [incorrectAddy,setIncorrectAddy] = useState<boolean>(false)
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
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 2rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <div>
        <img src={linkedinicon} title="link to my linkedin :)" alt="linkedin" onClick={() => window.open('https://www.linkedin.com/in/james-ma-3b7b71345/','_blank','noopener,noreferrer')} style={{width:'48px',height:'48px',cursor:'pointer'}}/>
      </div>
    </nav>

    <div className='enter-building' style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      <h1 className="main-title">NYC Building Energy Efficiency Checker</h1>
      <p className="subtitle">
        Discover and compare the energy performance of buildings across New York City. 
      </p>
      
      <div style={{zIndex:10000, marginBottom: '2rem', width: '100%', maxWidth: '600px'}}>
        <SearchBar userInput={addy} onChange={setAddy} notValid = {setIncorrectAddy} addMarker={handleAddMarker}/>
        <span style={{alignItems:"center",justifyContent:"center",color:"red",fontSize:"1.2rem",display:'flex'}}>{incorrectAddy && <div>Please enter a valid address</div>}</span>
      </div>
      
      {isClicked.click && 
        <div className="building-info-card" style={{ 
          width: "100%", 
          maxWidth: "600px",
          marginBottom: "2rem" 
        }}>
           <div style={{fontSize:"1.2rem", cursor:"pointer"}} onClick={()=>{
            const encodedAddress = encodeURIComponent(isClicked.name);
            if(window.confirm("Would you like to view this building on Google Maps?")){
              window.open(`https://www.google.com/maps/search/${encodedAddress}`,"_blank","noopener noreferrer")
            }
            }}>{isClicked.name} </div>
          <div><span  style={{fontSize:"1.2rem",justifyContent:"center",backgroundColor:"#dcfce7",color:"#166534",borderRadius:"9999px",padding:"0.25rem 0.75rem",fontWeight:"600"}}>{isClicked.score} </span>
            <span onClick={()=>{handleRemoveMarker();setIsClicked({click:false,name:"",score:null})}} style={{marginLeft:"5px",cursor:"pointer",fontSize:"1.2rem",justifyContent:"center",backgroundColor:"#ef4444",color:"white",borderRadius:"9999px",padding:"0.25rem 0.75rem",fontWeight:"600"}}>
              X
            </span>
          </div>
        </div>
      }

      <div style={{ 
        width: "100%", 
        maxWidth: "900px", 
        background: "white",
        borderRadius: "0.5rem",
        padding: "1.5rem",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
        marginBottom: "3rem"
      }}>
        <h2 style={{ 
          fontSize: "1.5rem", 
          fontWeight: "600", 
          color: "#111827", 
          textAlign: "center",
          margin: "0 0 0.5rem 0"
        }}>
          Interactive Energy Map
        </h2>
        <p style={{
          color: "#6b7280",
          textAlign: "center",
          margin: "0 0 1.5rem 0",
          fontSize: "0.875rem"
        }}>
          Explore building efficiency ratings across NYC boroughs
        </p>
        <Map ref={markerRef} setIsClicked={setIsClicked}/>
        <footer>
          <div style={{display:"flex",gap:"1rem",fontFamily:"sans-serif"}}>
            <span>Key:</span>
            <span><span style={{display:"inline-block",width:12,height:12,borderRadius:"50%",background:"green",marginRight:6}}/> ≥ 85</span>
            <span><span style={{display:"inline-block",width:12,height:12,borderRadius:"50%",background:"gold",marginRight:6}}/>84-70</span>
            <span><span style={{display:"inline-block",width:12,height:12,borderRadius:"50%",background:"orange",marginRight:6}}/>69-55</span>
            <span><span style={{display:"inline-block",width:12,height:12,borderRadius:"50%",background:"red",marginRight:6}}/>&lt; 55</span>
            <span><span style={{display:"inline-block",width:12,height:12,borderRadius:"50%",background:"gray",marginRight:6}}/>Null</span>
          </div>
        </footer>
      </div>
      
      <div style={{ 
        width: "100%", 
        maxWidth: "1000px", 
        display: "flex", 
        justifyContent: "center" 
      }}>
        <Leaderboard/>
      </div>
    </div>
  </>
)
}

export default App
