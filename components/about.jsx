import React from 'react'
import styles from '../styles/about.module.css'
import Image from 'next/image'
import Unique from '../public/img/unique.svg'
import Quality from '../public/img/quality.svg'
import Customer from '../public/img/customer.svg'

const About = () => {
  return (
    <div className={styles.container}>
        <div className={styles.hdrContainer}>
          <h1 className={styles.hdr}>About BurgerBox</h1>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.topContainer}>
            <div className={styles.descContainer}>
              <div className={styles.subHdrContainer}>
                <h2 className={styles.contentHdr}>Unique Tastes</h2>  
                <div className={styles.svgContainer}>
                <Image src={Unique} objectFit='fill'/>
                </div>
              </div>
              <div className={styles.subHdrContainer}>
                <h2 className={styles.contentHdr}>Quality Ingredients</h2>  
                <div className={styles.svgContainer}>
                <Image src={Quality} objectFit='fill'/>
                </div>
              </div>
              <div className={styles.subHdrContainer}>
                <h2 className={styles.contentHdr}>Customer-driven Service</h2>  
                <div className={styles.svgContainer}>
                <Image src={Customer} objectFit='fill'/>
                </div>
              </div>
            </div>
          <div className={styles.imgsContainer}>
          <div className={styles.imgContainer}>
            <Image 
              className={styles.img} 
              layout='fill' 
              src="/img/burgerimg.jpg"
              />
          </div>
          <div className={styles.imgContainer}>
            <Image 
              className={styles.img} 
              layout='fill' 
              src="/img/shake1.jpg"/>
          </div>
          <div className={styles.imgContainer}>
            <Image 
              className={styles.img} 
              layout='fill' 
              src="/img/fries.jpg"
              style={{transform: 'rotate(-90deg)'}}
              />
          </div>
          <div className={styles.imgContainer}>
            <Image 
              className={styles.img} 
              layout='fill' 
              src="/img/shake2.jpg"/>
          </div>
          </div>
          </div>
          <p className={styles.infoText}>
            BurgerBox is a brand that prides itself on offering the best quality beef smash patty burgers and unique menu options all-around. We provide quality in both our ingredients used to formulate our menu items as-well as the customer service used to deliver them. 
            We have a wide range of burgers, sides, drinks and deserts available to satisfy all our customers.
          </p>
        </div>
    </div>
  )
}

export default About