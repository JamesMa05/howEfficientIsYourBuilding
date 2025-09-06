import { useState,useEffect,useRef }from 'react'
import './Leaderboard.css'

export const Leaderboard = () => {
    const [maxPages,setMaxPages] = useState<number>(1)
    const [choosePage,setChoosePage] = useState<boolean>(false)
    const [goPage,setGoPage] = useState<number>(1)
    const [currPage , setCurrPage] = useState<number>(1)
    const [visiblePages, setVisiblePages] = useState<number[]>([])
    const maxVisible = 5;

    const API_BASE = import.meta.env.PROD ? 'https://howefficientisyourbuildingapi.onrender.com' : 'http://127.0.0.1:5000';
    const [cache,setCache] = useState<{[key:number]:any[]}>({})

    const getMaxPages = async () =>{
            try{
                const count = await fetch(`${API_BASE}/getlbcount`).then(res=>res.json())
                setMaxPages(count.count)
            }catch(err){
                console.log(err)
                setMaxPages(1)
            }
    } 
    //updates the leaderboard page toggle ui depending on which page user is on
    const getVisiblePages = () =>{
        const start = Math.max(1, currPage - Math.ceil(maxVisible / 2));
        const end = Math.min(maxPages, start + maxVisible - 1);
        let tempArr = Array<number>()
        for(let i = start; i<=end;i++){
            tempArr.push(i)
        }
        setVisiblePages(tempArr)
    }

    useEffect(()=>{
        getMaxPages()
    },[]);
    useEffect(()=>{
        getVisiblePages()
    },[maxPages,currPage])

    const getPage = async(page:number)=>{
        if(cache[page]){
            return;
        }
        setCurrPage(page)
        try{
            const Response = await fetch(`${API_BASE}/senddata?page=${page}`)
            if(!Response.ok){
                throw new Error(`Error ${Response.status}: ${Response.statusText}`)
            }
            const firstPage = await Response.json();
            setCache({...cache,[page]:firstPage})
        }catch(err){
            console.log(err);
        }
    };

    const pageChange = async(page:number) =>{
        setCurrPage(page);
        await getPage(page)

        const headerElement = document.querySelector('.leaderboard .header');
        if (headerElement) {
            headerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    const choosePageRef = useRef<HTMLDivElement>(null)
    useEffect(()=>{
        const handleClickOutside = (event:MouseEvent) => {
            if (choosePageRef.current && !choosePageRef.current.contains(event.target as Node)) {
                setChoosePage(false)
                setGoPage(currPage)
            }
        };
        if (choosePage) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [choosePage]);
    useEffect(()=>{
        getPage(1);
    },[])
    
    const goToLocation = (address:string) =>{
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/${encodedAddress}`)
    }
  return (
   <>  
       <div className="leaderboard">
           <div className="header">
               <h3 style={{
                   fontSize:"1.75rem",
                   fontWeight:"700", 
                   color:"#111827",
                   margin: 0,
                   marginBottom: "0.5rem",
                   textAlign:"center"
               }}>
                   NYC Building Efficiency Leaderboard
               </h3>
               <p style={{
                   fontSize:"1rem",
                   color:"#6b7280",
                   margin: 0,
                   textAlign:"center"
               }}>
                   Top performing buildings across New York City
               </p>
           </div>

           <div className="column-describers">
               <div style={{width:"80px", textAlign:"left", fontWeight:"600"}}>Rank</div>
               <div style={{width:"180px", marginLeft:"20px", textAlign:"left", fontWeight:"600"}}>Borough</div>
               <div style={{flex: 1, textAlign:"left", fontWeight:"600"}}>Address</div>
               <div style={{width:"100px", textAlign:"center", fontWeight:"600"}}>Score</div>
           </div>

           <div className="leaderboard-list">
               {cache[currPage]?.map((item,index)=>(
                   <div key={index} className="leaderboard-item">
                       <div style={{width:"80px", textAlign:"left", display:"flex", alignItems:"center"}}>
                           <span style={{
                               display:"inline-flex",
                               alignItems:"center",
                               justifyContent:"center",
                               width:"32px",
                               height:"32px",
                               backgroundColor:"#3b82f6",
                               color:"white",
                               borderRadius:"50%",
                               fontWeight:"600",
                               fontSize:"0.875rem"
                           }}>
                               {((currPage-1)*100)+index+1}
                           </span>
                       </div>
                       <div style={{width:"180px", marginLeft:"20px", textAlign:"left", fontSize:"0.875rem", color:"#374151"}}>
                           {JSON.stringify(item.Borough).replace(/"/g,"")}                              
                       </div>
                       <div style={{flex: 1, textAlign:"left", cursor:"pointer", fontSize:"0.875rem", color:"#111827", fontWeight:"500"}} 
                            onClick={()=>{goToLocation(JSON.stringify(item.Address_1).replace(/"/g,""));}}>
                           {JSON.stringify(item.Address_1).replace(/"/g,"")}
                       </div>
                       <div style={{width:"100px", textAlign:"center"}}>
                           <span style={{
                               display:"inline-flex",
                               alignItems:"center",
                               justifyContent:"center",
                               backgroundColor:"#dcfce7",
                               color:"#166534",
                               borderRadius:"9999px",
                               padding:"0.25rem 0.75rem",
                               fontSize:"0.75rem",
                               fontWeight:"600"
                           }}>
                               {JSON.stringify(item.ENERGY_STAR_Score).replace(/"/g,"")}
                           </span>
                       </div>                        
                   </div>
               ))} 
           </div>

           <div className="footer">
               {currPage > 1 && (
                   <button 
                       onClick={(e) => {
                           e.preventDefault();
                           pageChange(1);
                       }}
                       style={{
                           cursor:"pointer",
                           padding:"0.5rem 0.75rem",
                           borderRadius:"0.375rem",
                           backgroundColor: "white",
                           color: "#374151",
                           border: "1px solid #d1d5db",
                           fontWeight:"500",
                           minWidth:"40px",
                           textAlign:"center",
                           transition: "all 0.2s",
                           fontSize: "0.875rem"
                       }}
                   >
                       ≪
                   </button>
               )}
               
               {currPage > 1 && (
                   <button 
                       onClick={(e) => {
                           e.preventDefault();
                           pageChange(currPage-1);
                       }}
                       style={{
                           cursor:"pointer",
                           padding:"0.5rem 0.75rem",
                           borderRadius:"0.375rem",
                           backgroundColor: "white",
                           color: "#374151",
                           border: "1px solid #d1d5db",
                           fontWeight:"500",
                           minWidth:"40px",
                           textAlign:"center",
                           transition: "all 0.2s",
                           fontSize: "0.875rem"
                       }}
                   >
                       ‹
                   </button>
               )}
               
               {visiblePages.map(page => (
                   <button 
                       key={page}
                       onClick={(e) => {
                           e.preventDefault();
                           pageChange(page);
                       }}
                       style={{
                           cursor:"pointer",
                           padding:"0.5rem 0.75rem",
                           borderRadius:"0.375rem",
                           backgroundColor: page === currPage ? "#3b82f6" : "white",
                           color: page === currPage ? "white" : "#374151",
                           border: "1px solid #d1d5db",
                           fontWeight:"500",
                           minWidth:"40px",
                           textAlign:"center",
                           transition: "all 0.2s"
                       }}
                   >
                       {page}
                   </button>
               ))}
               
               <button 
                   onClick={(e) => {
                       e.preventDefault();
                       setChoosePage(true);
                   }}
                   style={{
                       cursor:"pointer",
                       padding:"0.5rem 0.75rem",
                       borderRadius:"0.375rem",
                       backgroundColor: "white",
                       color: "#374151",
                       border: "1px solid #d1d5db",
                       fontWeight:"500",
                       minWidth:"40px",
                       textAlign:"center",
                       transition: "all 0.2s",
                       fontSize: "0.875rem"
                   }}
               >
                   ...
               </button>
               
               {currPage < maxPages && (
                   <button 
                       onClick={(e) => {
                           e.preventDefault();
                           pageChange(currPage+1);
                       }}
                       style={{
                           cursor:"pointer",
                           padding:"0.5rem 0.75rem",
                           borderRadius:"0.375rem",
                           backgroundColor: "white",
                           color: "#374151",
                           border: "1px solid #d1d5db",
                           fontWeight:"500",
                           minWidth:"40px",
                           textAlign:"center",
                           transition: "all 0.2s",
                           fontSize: "0.875rem"
                       }}
                   >
                       ›
                   </button>
               )}
               
               {currPage < maxPages && (
                   <button 
                       onClick={(e) => {
                           e.preventDefault();
                           pageChange(maxPages);
                       }}
                       style={{
                           cursor:"pointer",
                           padding:"0.5rem 0.75rem",
                           borderRadius:"0.375rem",
                           backgroundColor: "white",
                           color: "#374151",
                           border: "1px solid #d1d5db",
                           fontWeight:"500",
                           minWidth:"40px",
                           textAlign:"center",
                           transition: "all 0.2s",
                           fontSize: "0.875rem"
                       }}>
                       ≫
                   </button>
               )}
               
               {choosePage  && (
                   <div className="page-input-modal">
                       <h2>Enter page number</h2>
                       <input 
                           type="number" 
                           value={goPage} 
                           onChange={(e)=>setGoPage(parseInt(e.target.value) || 1)}
                           onKeyDown={(e)=>{
                               if(e.key==="Enter"){
                                   if(goPage>maxPages){
                                       setGoPage(maxPages);
                                       pageChange(maxPages);
                                   }else if(goPage<1){
                                       setGoPage(1);
                                       pageChange(1);
                                   }else{
                                      pageChange(goPage); 
                                   }
                                   setChoosePage(false);
                               }
                           }}
                       />
                   </div>
               )}
           </div>
       </div>
   </>
)
}

export default Leaderboard