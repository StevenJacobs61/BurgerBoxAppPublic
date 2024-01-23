import React from 'react'
import styles from '../../styles/checkout.module.css'
import { useSettings } from '../../context/settingsContext';

export default function SelectDeliveryOption({setShowDeliver, showDeliver}) {
    const { settings } = useSettings();

  return (
        <div className={styles.deliver_container}>
          {
          settings?.del ? 
          <>
            <button className={styles.btn_deliver}
            onClick={() => setShowDeliver(true)} 
            style={{ 
              background: showDeliver ? '#101010' : '#fff', 
              color: showDeliver ? '#fff' : '#101010' }}>
            Deliver
            </button>
            <p className={styles.or}>OR</p>            
            <button className={styles.btn_collection}
            style={{ 
              background: !showDeliver ? '#101010' : '#fff', 
              color: !showDeliver ? '#fff' : '#101010' }}
            onClick={() => setShowDeliver(false)}>
              Collect
            </button>
          </> 
          : 
          <p className={styles.del_unavialable}>Delivery unavailable!</p>
          }
        </div>
  )
}
