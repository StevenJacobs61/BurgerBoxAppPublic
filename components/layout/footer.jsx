import React from 'react'
import styles from '../../styles/footer.module.css'
import Location from '../home/location'


const Footer = () => {
  return (
  <>
    <Location />
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.copyright}> © 2023 AppStarter. All rights reserved.</h2>
      </div>
    </section>
  </>
  )
}

export default Footer