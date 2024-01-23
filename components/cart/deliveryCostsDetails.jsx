import React from 'react'
import styles from '../../styles/checkout.module.css'

export default function DeliveryCostsDetails({location}) {
  
  return (
        location === "Seaford" ?
        <div className={styles.delivery_costs_container}>
            <p className={styles.costs_hdr}>Free Home Delivery:</p>
            <p className={styles.costs}><strong>Seaford + Bishopstone(BN25)</strong><br/>Orders over £13, else £3 charge</p>
            <p className={styles.costs}><strong>Denton + Newhaven(BN9)</strong><br/>Orders over £18, else £5 charge</p>
            <p className={styles.costs}><strong>Peacehaven(BN10) + Alfriston(BN26)</strong><br/>Orders over £26, else £6 charge</p>
            <p className={styles.text}>*All fields except &apos;Delivery Instructions&apos; are required.</p>
        </div>
        : null
        // Add Eastbourne delivery costs
  )
}
