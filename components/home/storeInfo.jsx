import React from 'react'
import Maps from './maps'
import styles from '../../styles/storeInfo.module.css'
import { handlePhoneNumberAction } from '../../functions/phoneNumber'

export default function StoreInfo() {
  return (
    <div className={styles.container}>
            <h1 className={styles.hdr}>Burger Box Seaford</h1>
        <div className={styles.infoContainer}>
            <h2 className={styles.info}
            onClick={()=>handlePhoneNumberAction("+44132389921")}
            >+44132389921</h2>
            <h2 className={styles.info}>email@email.com</h2>
            <h2 className={styles.info}>16 Dane Road, Seaford <br/>East Sussex, BN25 1LL </h2>
        </div>
        <div className={styles.mapContainer}>
            <Maps/>
        </div>
    </div>
  )
}
