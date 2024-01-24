import Image from 'next/image'
import React from 'react'
import styles from '../styles/menu_item.module.css'
import { useRouter } from 'next/router';
import {MdChildCare} from "react-icons/md"
import {GiHotMeal, GiKetchup} from "react-icons/gi"
import redirectWithQuery from "../functions/redirect"
import {useAlert} from "../context/alertContext"
import { useSettings } from '../context/settingsContext';
import logo from '../public/img/burger.webp'
import burger from '../public/img/justeat-burger.webp'
import { FaCirclePlus } from "react-icons/fa6";

const MenuItem = ({item, section}) => {
  const router = useRouter()

  const {setAlert, setAlertDetails} = useAlert();
  const{settings} = useSettings();

  const handleSelect = async () => {
    if(!item.available || !section.available){
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
    <div className={styles.container}
    onClick={handleSelect}
    style={{
      cursor: item.available && section.available ? "pointer" : "auto",
      opacity: item.available && section.available ? "1" : "0.7",
      boxShadow : item.available && section.available ? "" : "none"
    }}>
      <Image src={burger} alt='food picture'/>
      <div className={styles.contentContainer}>
      <h1 className={styles.title}>{item.title.slice(0, 20)}</h1>
      <div className={styles.bottomContainer}>
      <h2 className={styles.price}><p className={styles.from}>From</p>{item.price.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</h2>
      {
        item.available && section.available ? 
        <FaCirclePlus className={styles.icon} />
        :
        <p className={styles.unavailable}>Unavailable</p>
      }
      </div>
      </div>
      {/* <button className={styles.button}>Select Options</button> */}
    </div>
    // <div className={title === "sides" ? styles.sidesSection : styles.section}>
    //   <div className={styles.container} onClick={() => handleSelect()} style={{borderRadius: title === "sides" ? "50px" : ""}}>
    //         <h1 className={styles.title} style={{transform: title === "kids box meals" ? "scale(0.8)" : ""}}>{item.title}</h1>
    //          {title !== "sides" ? <div className={styles.img_wrapper}>
    //          {item.img ? 
    //             <Image className={styles.img} src={item.img} alt='kids burger' layout='fill'/>
    //           : title === "burgers" ?
    //           <Image className={styles.icon} src="/img/burger.webp" layout='fill'/>
    //           : title === "kids box meals" ?
    //           <MdChildCare className={styles.icon}/>
    //           : title === "dips" ?
    //           <GiKetchup className={styles.icon}/>
    //           : title === "freakshakes" ?
    //           <Image className={styles.icon} src="/img/milkshake.svg" width="90%" height="90%"/>
    //           : title === "dynamite prawns" ?
    //           <Image className={styles.icon} src="/img/shrimp.svg" width="90%" height="90%" style={{color:"#fff"}}/>
    //           : title === "dessert" ?
    //           <Image className={styles.icon} src="/img/waffle.svg" width="95%" height="95%"/>
    //           : title === "drinks" ?
    //           <Image className={styles.icon} src="/img/drink.svg" width="95%" height="95%"/>
    //           :
    //           <GiHotMeal className={styles.icon}/>}
    //           </div>: null}
    //         <div className={styles.price_container}>
    //           <p className={styles.from}>from</p>
    //           <h3 className={styles.price}>{item.price.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</h3>
    //         </div>
    //       {item.available && section.available && !settings.offline ?
    //           <button className={styles.btn} onClick={handleSelect} >Select options</button>
    //       : <p className={styles.text}> {settings.offline ? "Offline" : "Unavailable"}</p> }
    //   </div>
    // </div>
  )
}

export default MenuItem