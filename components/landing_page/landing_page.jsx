import React from 'react'
import { useState } from 'react'
import Hero from '../landing_page/hero'
import Info from './info'
import styles from "../../styles/LandingPage/landing_page.module.css"
import HeroComp from './heroComp'

const LandingPage = () => {

    const [complete, setComplete] = useState(false)

  return (
    <section className={styles.container}>
    </section>
  )
}

export default LandingPage