import React,{useEffect,useState} from 'react'

type SearchBarProps = {
    userInput: string;
    onChange:(value:string) => void
}
export const SearchBar: React.FC<SearchBarProps> = ({userInput,onChange}) => {
    const [cache,setCache] = useState<any[]>([])
    useEffect(()=>{
        if(userInput.trim() === ""){
            setCache([])
            return;
        }
        const timeout = setTimeout(() => {
            fetch('http://127.0.0.1:5000/searchalike',{
            method:'POST',headers: {'Content-Type':'application/json'},body: JSON.stringify({query: userInput})
            }).then(res=>res.json())
            .then(data=>setCache(data))
            .catch(err=>prompt(err));
        }, 150)
        
        return () => clearTimeout(timeout)
    },[userInput])
    
  return (
    <>
        <div style={{zIndex:2}}>
            <input placeholder="Enter your building" className="search-building" style={{
            border: "3px solid #384959",
            marginTop: 0,
            borderRadius: "0.3rem",
            padding: "0.5rem",
            fontSize: "1rem",
            width: "30vw",
            textAlign: "center"
            }} onChange={(e)=>{
                onChange(e.target.value)
            }} value={userInput}></input>
            <div style={{overflowY:'scroll',maxHeight:"200px"}}>
            {cache?.map((item,index)=>(
                <div key={index} style={{
                border: "3px solid #384959",
                marginTop: 0,
                borderRadius: "0.3rem",
                padding: "0.5rem",
                fontSize: "1rem",
                width: "30vw",
                textAlign: "center",
                background:"white",
                zIndex:1
                }}>
                    {JSON.stringify(item.Address_1).replace(/"/g,"")}
                </div>
            ))}
            </div>
        </div>
    </>
  )
}

export default SearchBar