import React ,{ useState,useEffect }from 'react'
import './Leaderboard.css'
import leftButton from '../src/assets/leftButton.svg'
import maxLeftButton from '../src/assets/maxLeftButton.svg'
import PageNumIcon from '../src/assets/PageNum.tsx'
import rightButton from '../src/assets/rightButton.svg'
import maxRightButton from '../src/assets/maxRightButton.svg'

export const Leaderboard = () => {
    const [maxPages,setMaxPages] = useState<number>(1)

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
  return (
    <>  
        <div className="leaderboard">
            <div style={{overflowY:"scroll"}} className="leaderboard-list">
                {cache[currPage]?.map((item,index)=>(
                    <div key={index}>{index+1}{JSON.stringify(item.Borough)} and {JSON.stringify(item.Address_1)}</div>
                ))} 
            </div>
            <div className="footer">
                {currPage > 1 && <img src={maxLeftButton} onClick={()=>pageChange(1)}alt="" style={{display:"inline-block", cursor:"pointer", width:"40px",height:"36px"}}/>}
                {currPage > 1 && <img src={leftButton} onClick={()=>pageChange(currPage-1)}alt="" style={{display:"inline-block", cursor:"pointer", width:"40px",height:"36px"}}/>}
                {visiblePages.map(page => (
                    page === currPage ? (
                        <span onClick={() => pageChange(page)}><PageNumIcon key={page} page={page} ></PageNumIcon></span>
                    ) : (
                        <span onClick={() => pageChange(page)}><PageNumIcon key={page} page={page} ></PageNumIcon></span>
                    )
                ))}
                {currPage < maxPages && <img src={rightButton} onClick={()=>pageChange(currPage+1)}alt="" style={{display:"inline-block", cursor:"pointer", width:"40px",height:"36px"}}/>}
                {currPage < maxPages && <img src={maxRightButton} onClick={()=>pageChange(maxPages)}alt="" style={{display:"inline-block", cursor:"pointer", width:"40px",height:"36px"}}/>}
            </div>
        </div>

    </>
    
  )
}
