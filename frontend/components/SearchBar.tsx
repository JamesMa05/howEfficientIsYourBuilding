import React,{useEffect,useState} from 'react'

type SearchBarProps = {
    userInput: string;
    onChange:(value:string) => void
}
export const SearchBar: React.FC<SearchBarProps> = ({userInput,onChange}) => {
    const [cache,setCache] = useState<{[key:number]:any[]}>({})
    useEffect(()=>{
        fetch('http://127.0.0.1:5000/searchalike',{
            method:'POST',headers: {'Content-Type':'application/json'},body: JSON.stringify({query: userInput})
        }).then(res=>res.json())
    },[userInput])
  return (
    <>
        <div>
            <input placeholder="Enter your building" className="search-building" style={{
            border: "3px solid #384959",
            marginTop: 0,
            borderRadius: "0.3rem",
            padding: "0.5rem",
            fontSize: "1rem",
            width: "30vw",
            textAlign: "center"
            }} onChange={async (e)=>{
                await onChange(e.target.value)
                console.log(userInput)
            }} value={userInput}></input>
        </div>
    </>
  )
}

export default SearchBar