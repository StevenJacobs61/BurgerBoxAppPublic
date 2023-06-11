import React from 'react'
import styles from '../styles/menu.module.css'
import MenuSection from './menu_section'
import { useState, useEffect } from 'react'
import {  useRouter } from 'next/router'
import MenuItem from './menu_item'
import redirectWithQuery from '../functions/redirect'
import { getTotal } from '../functions/total'


const Menu = ({sectionsList, productsList, settings, setAlert, setAlertDetails}) => {
  
const [currentSection, setCurrentSection] = useState(sectionsList[0])  
  
const [width, setWidth] = useState();
const [total, setTotal] = useState(() => getTotal()) 
const router = useRouter();


const handleWidth = () => {
  setWidth(window.innerWidth)
}

useEffect(() => {
  setWidth(window.innerWidth)
  window.addEventListener("resize", handleWidth)
}, [])

  return (
    <section className={styles.section}>
        <div className={styles.container}>
          <h1 className={styles.hdr}>ORDER</h1>
          <div className={styles.menu_container}>
            <div className={styles.sections_container}>
              {sectionsList.map((section) =>(
              <MenuSection key={section._id} 
              width={width} 
              setCurrentSection={setCurrentSection} 
              currentSection={currentSection} 
              settings={settings} 
              productsList={productsList} 
              section={section}
              setAlert={setAlert}
              setAlertDetails={setAlertDetails}/>
              ))}
                {width > 768 ? <div className={styles.checkout}>
            {!settings.offline ? <><p className={styles.text}>Total: {total.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</p>
            <button className={styles.basketButton} onClick={async () => await redirectWithQuery("/cart", router)}>basket</button>
            </> 
            : 
            <p className={styles.offline}>Offline</p>
            } 
          </div> : null}
            </div>
            <div className={styles.items_container}>
              <h2 className={styles.menu_hdr}>{currentSection.title}</h2>
              <div className={styles.items_wrapper}>
              {productsList.filter((i) => i.section === currentSection?.title).map((item)=>
                <MenuItem key={item._id} 
                item={item} 
                section={currentSection} 
                settings={settings}/>
              )}  
              </div>
            </div>
          </div>
          {width < 769 ? <div className={styles.checkout}>
            {!settings.offline ? 
            <>
            <p className={styles.text}>Total: {total.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</p>
            <button className={styles.basketButton} onClick={async () => await redirectWithQuery("/cart", router)}>basket</button>
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