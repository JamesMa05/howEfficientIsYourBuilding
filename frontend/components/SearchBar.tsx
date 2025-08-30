import React,{useEffect,useState,useRef} from 'react'
import './SearchBar.css'

type InputState = {
    text:string;
    selected?:any
}
type SearchBarProps = {
    userInput: InputState;
    onChange:(value: InputState) => void;
    addMarker:()=>void
    notValid: React.Dispatch<React.SetStateAction<boolean>>;
}
export const SearchBar: React.FC<SearchBarProps> = ({userInput,onChange,addMarker,notValid}) => {
    const [cache,setCache] = useState<any[]>([])
    const [displaySimilar,setDisplaySimilar] = useState<boolean>(false)
    useEffect(()=>{
        if(userInput.text.trim() === ""){
            setCache([])
            return;
        }
        const timeout = setTimeout(() => {
            fetch('http://127.0.0.1:5000/searchalike',{
            method:'POST',headers: {'Content-Type':'application/json'},body: JSON.stringify({query: userInput.text})
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
        <div className="search-bar" ref={containerRef}>
            <div className="search-input-container">
                <input  
                    placeholder="Search by building name, address, or borough..." 
                    className="search-building"
                    onKeyUp={(e)=>{
                        if(e.key === "Enter" && cache.length > 0){
                            setDisplaySimilar(false);
                            onChange({text: JSON.stringify(cache[0].Address_1).replace(/"/g,""),selected:cache[0]});
                        }
                    }}
                    onClick={()=>setDisplaySimilar(true)}
                    onChange={(e)=>{
                        setDisplaySimilar(true);
                        onChange({...userInput,text:e.target.value});
                    }} 
                    value={userInput.text}
                />
                <button className="add-button" onClick={()=>{
                    if(userInput.selected!==null && userInput.text.length>0){
                        addMarker();
                        notValid(false);
                    }else{
                        notValid(true)
                    }
                }}>
                    ADD
                </button>
            </div>

            {displaySimilar && (
                <div className="search-bar-results" style={{overflowY:"scroll",maxHeight:"21.25vh"}}>
                    {cache?.map((item,index)=>(
                        <div key={index} className="search-option" 
                             onClick={()=>{
                                setDisplaySimilar(false);
                                onChange({text:JSON.stringify(item.Address_1).replace(/"/g,""),selected:item})
                             }}>
                            {JSON.stringify(item.Address_1).replace(/"/g,"")}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </>
)
}

export default SearchBar