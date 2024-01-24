import React from 'react'
import styles from '../../styles/LandingPage/info.module.css'
import {AiOutlineArrowDown} from 'react-icons/ai';
import { useRouter } from 'next/router';
import { useSettings } from '../../context/settingsContext';
import { useMenu } from '../../context/menuContext';


const Info = ({complete}) => {

    const {settings} = useSettings();
    const {sections} = useMenu();
    const router = useRouter();
    const open = sections.some((section) => section.available); 
    
    const openWordStyle = {
        animation: !complete ? "10s animate 3s infinite alternate" : null,
        // color: open && !settings.offline ? "#0ba800" : "#be0606", 
        // textShadow: !open || settings.offline ? "none" : complete ? "var(--textShadow-green)" : null, 
      }
    

  return (
    <div className={styles.container}>
    <div className={styles.open}>
      <div className={styles.open_container}>
        <h2 className={styles.open_text}>We are</h2>
        <p className={styles.open_word} style={openWordStyle}>{open && !settings.offline ? "Open" : !open && !settings.offline ? "Closed" : "Offline"}</p>
      </div>
      {settings.offline && open ?
      <div className={styles.offline_notice_container}>
        <h3 className={styles.offline_notice}> We are not accepting orders here at the moment, please order using the Just Eat from the link below.. We aim to be be back soon! </h3>
        <div className={styles.deliveryContainer}>
        <h2 className={styles.justeat} onClick={() => router.push("https://www.just-eat.co.uk/restaurants-burger-box-east-blatchington-bn25/menu")}>Just eat</h2>
        <h2 className={styles.deliveroo} onClick={() => router.push("https://deliveroo.co.uk/menu/brighton/seaford/burger-box-seaford")}>Deliveroo</h2>
        </div>
      </div>
    : null}
      <p className={styles.opening_times}>Open 6 days a week<br/> 3.30 - 10pm <br></br>Closed Tuesdays </p>
        {  settings.noticeOn ? 
        <div className={styles.notice_container}>
    <h3 className={styles.notice_hdr} >Notice!</h3>
    <p className={styles.notice}>{settings.notice}</p>
    </div>
    : null}
        {!settings.del ? <h2 className={styles.noDel}>
        collection only!
      </h2>
      : null}
      <h2 className={styles.order_below}>{open && !settings.offline ? "Order below" : open && settings.offline || !open ?  "Browse Menu below" : null}</h2>
      <AiOutlineArrowDown className={styles.icon}/>
    </div>
  </div>
  )
}

export default Info