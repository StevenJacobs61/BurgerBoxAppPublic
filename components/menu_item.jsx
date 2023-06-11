import Image from 'next/image'
import React, { useState } from 'react'
import styles from '../styles/menu_item.module.css'
import { useRouter } from 'next/router';
import {MdChildCare, MdOutlineFastfood, MdOutlineLocalDrink} from "react-icons/md"
import {GiHotMeal, GiCakeSlice, GiKetchup} from "react-icons/gi"
import redirectWithQuery from "../functions/redirect"

const MenuItem = ({item, section, settings, setAlert, setAlertDetails}) => {
  const router = useRouter()

  const handleSelect = async () => {
    if(!item.available){
      setAlertDetails({
        header: "Alert",
        message: "Sorry, this product is currently unavailable.",
        type: "alert",
        onClose: setAlert,
        onConfirm: null,
      });
      setAlert(true);
      return;
    } 
    else {
      await redirectWithQuery(`/product/${item._id}`, router)
    }
  }
  const title = section.title.toLowerCase()
  return (
    <div className={styles.section}>
      <div className={styles.container} onClick={() => handleSelect()}>
            <h1 className={styles.title}>{item.title}</h1>
             <div className={styles.img_wrapper}>
             {item.img ? 
                <Image className={styles.img} src={item.img} alt='kids burger' layout='fill'/>
              : title === "burgers" ?
              <MdOutlineFastfood className={styles.icon}/>
              : title === "kids box meals" ?
              <MdChildCare className={styles.icon}/>
              : title === "dips" ?
              <GiKetchup className={styles.icon}/>
              : title === "dessert" ?
              <GiCakeSlice className={styles.icon}/>
              : title === "drinks" ?
              <MdOutlineLocalDrink className={styles.icon}/>
              : <GiHotMeal className={styles.icon}/>}
              </div>
            <div className={styles.price_container}>
              <p className={styles.from}>from</p>
              <h3 className={styles.price}>{item.price.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</h3>
            </div>
          {item.available && section.available && !settings.offline ?
              <button className={styles.btn} onClick={handleSelect} >Select options</button>
          : <p className={styles.text}> {settings.offline ? "Offline" : "Unavailable"}</p> }
      </div>
    </div>
  )
}

export default MenuItem