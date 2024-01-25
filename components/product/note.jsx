import React from 'react'
import styles from '../../styles/product.module.css'

export default function Note({setNote}) {
  return (
    <>
         <div className={styles.note_container}>
            <h3 className={styles.info_hdr} >Allergy Advice:</h3>
            <p className={styles.info_text}>Please call to inform our staff on 01323 899221 if you have any allergies or dietry requirments so that we can advise you and avoid any unwanted reactions and accomodate your needs accordingly.</p>
            <p className={styles.info_text}>Our dishes may contain: molluscs, lupin, sulphates, sesame, mustard, nuts, milk, fish, eggs, crustaceans and cereals containing gluton.</p>
        </div>
        <div className={styles.note_container}>
            <h3 className={styles.info_hdr} >Special Instructions:</h3>
            <p className={styles.info_text}>Please detail any special instructions or requirements here. For allegy information, call in store at.</p>
            <p className={styles.info_text}>Max 75 characters</p>
            <textarea 
                className={styles.info_input} 
                placeholder="Write information here..." 
                maxLength="75" 
                onChange={(e) => setNote(e.target.value)}
            />
        </div>
    </>
  )
}
