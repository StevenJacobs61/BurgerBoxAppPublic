import React from 'react'
import styles from '../styles/menu.module.css'
import {  useRouter } from 'next/router'
import redirectWithQuery from '../functions/redirect'
import { useSettings } from '../context/settingsContext'
import { useOrder } from '../context/orderContext'
import { GiShoppingCart } from "react-icons/gi";
import MenuComp from './home/menuComp'


const Menu = ({menuRef}) => {
  
  const {settings, width} = useSettings();
  const {total} = useOrder;
  const router = useRouter();

  return (
    <section className={styles.section} ref={menuRef}>
        <div className={styles.container}>
          {total ? 
            <p className={styles.text}>Total: {total ? total?.toLocaleString("en-US", {style: "currency", currency: "GBP"}) : "£0.00"}</p>
            : null
          }

          <MenuComp />

          {width < 769 ? <div className={styles.checkout}>
            {!settings.offline ? 
            <>
            <button 
              className={styles.basketButton} 
              onClick={async () => await redirectWithQuery("/cart", router)}
            >
            <GiShoppingCart width={100} height={100}/>
            </button>
            </> 
            : 
            <p className={styles.offline}>Offline</p>
            } 
          </div> : null}
        </div>
    </section>
  )
}

export default Menu