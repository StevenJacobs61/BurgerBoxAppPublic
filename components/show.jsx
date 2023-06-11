import React from 'react'
import styles from '../styles/show.module.css'
import {AiOutlineClose} from 'react-icons/ai';


const Show = ({children, setShow, setShowObject}) => {

const handleClick = (e) =>{
  if(setShowObject && e.target.id == 1){
    setShowObject()
    return
  }
  if(e.target.id == 1 && setShow) setShow(false)
}

  return (
    <div className={styles.container} id={1} onClick={(e)=>handleClick(e)}
    style={{top: window.innerWidth >= 1024 ? window.scrollY : null,
    justifyContent: window.innerWidth > 1024 && window.location.pathname === "/admin" ? "flex-start" : "center"}}>
    <div className={styles.wrapper} id={1}>
    <AiOutlineClose className={styles.close} 
    onClick={() => 
      {if(!setShow){
        setShowObject()
        return
      }
      setShow(false)
    }
    }>Close</AiOutlineClose>
    {children}
    </div>
    </div>
  )
}

export default Show