import React ,{ useState,useEffect,useRef }from 'react'
import './Leaderboard.css'
import leftButton from '../src/assets/leftButton.svg'
import maxLeftButton from '../src/assets/maxLeftButton.svg'
import PageNumIcon from '../src/assets/PageNum.tsx'
import rightButton from '../src/assets/rightButton.svg'
import maxRightButton from '../src/assets/maxRightButton.svg'
import dotdotdot from '../src/assets/dotdotdot.svg'

export const Leaderboard = () => {
    const [maxPages,setMaxPages] = useState<number>(1)
    const [choosePage,setChoosePage] = useState<boolean>(false)
    const [goPage,setGoPage] = useState<number>(1)
    const [currPage , setCurrPage] = useState<number>(1)
    const [visiblePages, setVisiblePages] = useState<number[]>([])
    const maxVisible = 5;

    const [cache,setCache] = useState<{[key:number]:any[]}>({})

    const getMaxPages = async () =>{
            try{
                const count = await fetch('http://127.0.0.1:5000/getlbcount').then(res=>res.json())
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
        await setCurrPage(page)
        try{
            const Response = await fetch(`http://127.0.0.1:5000/senddata?page=${page}`)
            if(!Response.ok){
                throw new Error(`Error ${Response.status}: ${Response.statusText}`)
                return alert("error")
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
    /* add zip code into search */
    const goToLocation = (address:string) =>{
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/${encodedAddress}`)
    }
  return (
    <>  
        <div className="leaderboard" style={{borderRadius:"1.5rem"}}>
            <div className="header">
                <div style={{display:"flex",alignItems:"center", justifyContent:"center",fontFamily:"Permanent Marker"}}>Leaderboard</div>
                <div className="column-describers" id="column-describers" style={{fontFamily:"Permanent Marker",display:"flex", flexDirection:"row"}}>
                    <p style={{width:"50px", marginLeft:"60px",textAlign:"left"}}>Rank</p>
                    <p style={{width:"200px", marginLeft:"60px",textAlign:"center"}}>Borough</p>
                    <p style={{width:"400px",textAlign:"center"}}>Address</p>
                    <p style={{width:"150px",textAlign:"right"}}>Score</p>
                </div>
            </div>
            <div style={{overflowY:"scroll"}} className="leaderboard-list">
                {cache[currPage]?.map((item,index)=>(
                    <div key={index} style={{display:"flex",fontFamily:"Permanent Marker"}}>
                        <div style={{width:"50px", marginLeft:"60px",textAlign:"left"}}>
                            <PageNumIcon page={((currPage-1)*100)+index+1} colour={"black"}/>
                        </div>
                        <div style={{width:"200px",marginLeft:"60px",textAlign:"center"}}>
                            {JSON.stringify(item.Borough).replace(/"/g,"")}                              
                        </div>
                        <div style={{width:"400px",textAlign:"center",cursor:"pointer"}} onClick={()=>{
                            goToLocation(JSON.stringify(item.Address_1).replace(/"/g,""));
                        }}>
                            {JSON.stringify(item.Address_1).replace(/"/g,"")}
                        </div>
                        <div style={{width:"150px",textAlign:"right"}}>
                            {JSON.stringify(item.ENERGY_STAR_Score).replace(/"/g,"")}
                        </div>                        
                </div>
                ))} 
            </div>
            <div className="footer">
                {currPage > 1 && <img src={maxLeftButton} onClick={()=>pageChange(1)}alt="" style={{display:"inline-block", cursor:"pointer", width:"40px",height:"36px"}}/>}
                {currPage > 1 && <img src={leftButton} onClick={()=>pageChange(currPage-1)}alt="" style={{display:"inline-block", cursor:"pointer", width:"40px",height:"36px"}}/>}
                {currPage == maxPages &&<img src={dotdotdot} style={{display:"inline-block", cursor:"pointer", width:"40px",height:"40px"}} onClick={()=>setChoosePage(true)}></img>}
                {visiblePages.map(page => (
                    <span key={page} style={{cursor:"pointer"}} onClick={() => pageChange(page)}><PageNumIcon  page={page} colour={"black"}></PageNumIcon></span>
                ))}
                {choosePage && 
                <div ref={choosePageRef} style={{
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center", 
                    zIndex:"10",
                    transform: 'translate(-50%, -50%)',
                    top:'50%',
                    left:'50%',
                    position:"fixed",
                    background:"#BDDDFC",
                    border:"2px solid #384959",
                    padding:"20px",
                    flexDirection:"column",
                    borderRadius:"0.5rem"}}>
                    <h1>Enter page number</h1>
                    <input type="text" style={{margin:'0 auto'}}inputMode="numeric" value={goPage} onChange={(e)=>setGoPage(parseInt(e.target.value))}onKeyDown={(e)=>{
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
                    }}}></input> 
                </div>}
                {currPage < maxPages &&<img src={dotdotdot} style={{display:"inline-block", cursor:"pointer", width:"40px",height:"40px"}} onClick={()=>setChoosePage(!choosePage)}></img>}
                {currPage < maxPages && <img src={rightButton} onClick={()=>pageChange(currPage+1)}alt="" style={{display:"inline-block", cursor:"pointer", width:"40px",height:"36px"}}/>}
                {currPage < maxPages && <img src={maxRightButton} onClick={()=>pageChange(maxPages)}alt="" style={{display:"inline-block", cursor:"pointer", width:"40px",height:"36px"}}/>}
            </div>
        </div>

    </>
    
  )
}
