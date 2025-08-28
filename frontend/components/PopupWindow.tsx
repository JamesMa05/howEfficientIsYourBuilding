type windowText = {
    text: string
}
type PopupWindowProps = {
    windowText:windowText;
    isOpen: boolean;
}

export const PopupWindow: React.FC<PopupWindowProps> = ({isOpen,windowText}) => {
  return (
    <div style={{display:"flex",flexDirection:"column"}}>
        <div>
            
        </div>        
    </div>
  )
}

export default PopupWindow;