import { useState, type Key } from 'react'
import {Leaderboard} from '../components/Leaderboard.tsx'
import LeftArrowButton from './assets/leftArrowButton.tsx'
import SearchBar from '../components/SearchBar.tsx'
import './App.css'

function App() {
  const [addy,setAddy] = useState<string>("")
  const processKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(addy)
    }
  }

  return (
    <>

      <div id='Enter your building' className='enter-building'>
        <div>Building Electricity Efficiency Checker</div>
        <h3 style={{fontSize:"1.1rem",marginTop:"0.5vh ",fontWeight:"normal"}}>How does your building pair up?</h3>
        <input placeholder="Enter your building" className="search-building" onChange={(e) => setAddy(e.target.value)} onKeyDown={processKey} style={{border:"3px solid #384959"}}></input>
        <Leaderboard/>

        <SearchBar userInput={addy} onChange={setAddy}/>
      </div>

      
    </>
  )
}

export default App
