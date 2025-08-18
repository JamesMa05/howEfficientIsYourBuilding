import React from 'react'
import pageNum from './pageNum.svg'

interface PageNumIconProps{
    page:number;
}

export const PageNumIcon: React.FC<PageNumIconProps> = ({page}) => {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr",gridTemplateRows:"1fr",placeItems:"center"}}>
        <img src={pageNum} alt="" style={{display:"block", cursor:"pointer", width:"48px",height:"48px",gridArea:"1/1"}}/>
        <span style={{fontFamily:"Permanent Marker",gridArea:'1/1',alignSelf:"center",justifySelf:"center",marginBottom:"15px",fontSize:"20px",color:"white",cursor:"pointer"}}>{page}</span>
    </div>
  )
}

export default PageNumIcon;