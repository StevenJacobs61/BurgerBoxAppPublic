import React from 'react'
import styles from "../../styles/heroComp.module.css"
import Image from 'next/image'
import { useSettings } from '../../context/settingsContext'
import { useMenu } from '../../context/menuContext'
import justeat from '../../public/img/justeat.svg'
import deliveroo from '../../public/img/deliveroo.svg'
import { useRouter } from 'next/router'

export default function HeroComp({menuRef}) {

  const {settings} = useSettings();
  const {open} = useMenu();
  const router = useRouter();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.imgContainer}>
      <img className={styles.img} src="/img/burger1.webp" loading="eager" alt='logo' />
      </div>
      {
        settings?.offline  && open ?
        <div className={styles.offlineContainer}>
          <h2 className={styles.offlineHdr}>Order using <br/> JustEat or Deliveroo</h2>
          <div className={styles.buttonContainer}>
            <Image 
              className={styles.icon} 
              src={justeat} 
              alt='justeat' 
              objectFit='contain'
              onClick={()=> router.push("https://www.just-eat.co.uk/restaurants-burger-box-east-blatchington-bn25/menu")}
              /> 
            <Image 
              className={styles.icon} 
              src={deliveroo} 
              alt='justeat' 
              objectFit='contain'
              onClick={()=> router.push("https://deliveroo.co.uk/menu/brighton/seaford/burger-box-seaford")}s
              /> 
          </div>
        </div>
        :
        <button className={styles.button} 
        style={{
          color: open ? "" : "var(--btn--del)",
          background: open ? "" : "none"}}
          onClick={async()=> menuRef.current.scrollIntoView({behavior: "smooth"})}>
            {open ? "Order now" : "Closed"}
        </button>
      }
    {settings?.discount?.active ? 
      <h1 className={styles.message}>{settings.discount.message}</h1>
      : null
    }
    </div>
  )
}
