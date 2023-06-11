import React, { useEffect, useState } from 'react'
import styles from '../../styles/footer.module.css'
import Location from '../home/location'
import { useSelector } from 'react-redux'


const Footer = () => {
  const admin = useSelector((state) => state.user)
  return (
    <>
  { !admin.admin ?
  <>
        <Location />
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.copyright}> © Copyright, all rights reserved.</h2>
      </div>
    </section>
    </>
  : null}
  </>
  )
}

export default Footer