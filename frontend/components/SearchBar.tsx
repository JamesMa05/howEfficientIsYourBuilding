import React,{useEffect,useState,useRef} from 'react'

type SearchBarProps = {
    userInput: string;
    onChange:(value:string) => void
}
export const SearchBar: React.FC<SearchBarProps> = ({userInput,onChange}) => {
    const [cache,setCache] = useState<any[]>([])
    const [displaySimilar,setDisplaySimilar] = useState<boolean>(false)
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
    
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        const handleClickOutside = (event:MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setDisplaySimilar(false)
            }
        };
        if (displaySimilar) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [displaySimilar]);

  return (
    <>
        <div style={{position:"relative"}} ref={containerRef}>
            <input  placeholder="Enter your building" className="search-building" style={{
            border: "3px solid #384959",
            marginTop: 0,
            borderRadius: "0.3rem",
            padding: "0.5rem",
            fontSize: "1rem",
            width: "30vw",
            textAlign: "center"
            }} onClick={()=>setDisplaySimilar(true)}
            onChange={(e)=>{
                onChange(e.target.value)
            }} value={userInput}></input>

            {displaySimilar && <div style={{overflowY:'scroll',maxHeight:"200px",position:"absolute",top:"100%", cursor:"pointer"}}>
                {cache?.map((item,index)=>(
                    <div key={index} className="search-option" style={{
                    border: "3px solid #384959",
                    marginTop: 0,
                    borderRadius: "0.3rem",
                    padding: "0.5rem",
                    fontSize: "1rem",
                    width: "30vw",
                    textAlign: "center",
                    background:"white",
                    zIndex:5,
                    }} onClick={()=>{setDisplaySimilar(false);onChange(JSON.stringify(item.Address_1).replace(/"/g,""))}}>
                        {JSON.stringify(item.Address_1).replace(/"/g,"")}
                    </div>
                ))}
            </div>}
        </div>
    </>
  )
}

export default SearchBar