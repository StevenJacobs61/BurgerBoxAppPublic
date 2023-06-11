import React from 'react'
import { useState } from 'react'
import Hero from '../landing_page/hero'
import Info from './info'
import styles from "../../styles/LandingPage/landing_page.module.css"

const LandingPage = ({sections, settings}) => {

    const [complete, setComplete] = useState(false)

  return (
    <section className={styles.container}>
        <Hero settings={settings} complete={complete} setComplete={setComplete}/> 
        <Info sections={sections} settings={settings} complete={complete}/>
    </section>
  )
}

export default LandingPage