import React from 'react'
import pageNum from './pageNum.svg'

interface PageNumIconProps{
    page:number;
    colour:string;
}

export const PageNumIcon: React.FC<PageNumIconProps> = ({page,colour}) => {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr",gridTemplateRows:"1fr",placeItems:"center"}}>
        <img src={pageNum} alt="" style={{display:"block", width:"48px",height:"48px",gridArea:"1/1"}}/>
        <span style={{fontFamily:"Permanent Marker",gridArea:'1/1',alignSelf:"center",justifySelf:"center",marginBottom:"15px",fontSize:"20px",color:colour}}>{page}</span>
    </div>
  )
}

export default PageNumIcon;