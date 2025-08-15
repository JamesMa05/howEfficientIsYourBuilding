import React ,{ useState,useEffect }from 'react'

export const Leaderboard = () => {
    const [maxPages,setMaxPages] = useState<number>(1)

    const [currPage , setCurrPage] = useState<number>(1)
    const [visiblePages, setVisiblePages] = useState<number[]>([])
    const maxVisible = 5;

    const [cache,setCache] = useState(
        {index: 1,
        pages:[]
    })
    const [nextPage,setNextPage] = useState(0)

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
        let tempArr = []
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
    },[maxPages])
  return (
    <>
        <div>{maxPages}</div>
        <div>
            {visiblePages.map(page=>(<button key={page}>{page}</button>))}
            <button onClick={getVisiblePages}>+</button> 
        </div>
        

    </>
    
  )
}
