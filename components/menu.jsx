import React from 'react'
import styles from '../styles/menu.module.css'
import MenuSection from './menu_section'
import { useState, useEffect } from 'react'
import {  useRouter } from 'next/router'
import MenuItem from './menu_item'
import redirectWithQuery from '../functions/redirect'
import { useSettings } from '../context/settingsContext'
import { useMenu } from '../context/menuContext'
import { useOrder } from '../context/orderContext'
import { GiShoppingCart } from "react-icons/gi";


const Menu = ({menuRef}) => {
  
  const {settings} = useSettings();
  const {sections, products} = useMenu();
  const {total} = useOrder;
  const [currentSection, setCurrentSection] = useState(sections[0])  
  
const [width, setWidth] = useState();
const router = useRouter();

const handleWidth = () => {
  setWidth(window.innerWidth)
}

useEffect(() => {
  setWidth(window.innerWidth)
  window.addEventListener("resize", handleWidth)
}, [])

  return (
    <section className={styles.section} ref={menuRef}>
        <div className={styles.container}>
        {total ? 
          <p className={styles.text}>Total: {total ? total?.toLocaleString("en-US", {style: "currency", currency: "GBP"}) : "£0.00"}</p>
          : null
        }

          <div className={styles.menu_container}>
            <div className={styles.sections_container}>
              {sections.map((section) =>(
                <MenuSection key={section._id} 
                width={width} 
                setCurrentSection={setCurrentSection} 
                currentSection={currentSection} 
                section={section}
                />
              ))}
              {width > 768 ? <div className={styles.checkout}>
                  {!settings.offline ? 
                  <>
                    <button 
                      className={styles.basketButton} 
                      onClick={async () => await redirectWithQuery("/cart", router)}>
                      <GiShoppingCart width={100} height={100}/>
                    </button>
                    <p className={styles.text}>
                      Total:{" "}
                      {total?.toLocaleString("en-US", {style: "currency", currency: "GBP"})}
                    </p>
                  </> 
                  : 
                  <p className={styles.offline}>Offline</p>
                  } 
                  </div> 
              : null}
            </div>

            <div className={styles.items_container}>
              <h2 className={styles.menu_hdr}>{currentSection?.title}</h2>
              <div className={styles.items_wrapper}>
              {products.filter((i) => i.section === currentSection?.title).map((item)=>
                <MenuItem key={item._id} 
                item={item} 
                section={currentSection} 
                />
              )}  
              </div>
            </div>
          </div>
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