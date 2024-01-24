import React, { useEffect, useState } from 'react'
import styles from '../styles/about.module.css'
import { useSettings } from '../context/settingsContext'
import { isMobile } from 'react-device-detect'
import { handlePhoneNumberAction } from '../functions/phoneNumber'

const About = () => {

  const {settings} = useSettings();
  const phoneNumber = '+44132389921';

  return (
    <div className={styles.container}>
          <h1 className={styles.hdr}>About BurgerBox</h1>
        <div className={styles.contentContainer}>
        <p className={styles.text}>Open 3.30pm - 10pm. Closed Tuesdays </p>
          <p className={styles.infoText}>
           <strong>BurgerBox</strong>  is a brand that <u>prides</u> itself on offering the <em>best quality beef smash patty burgers</em>  and unique menu options all-round. We provide <strong>quality ingredients</strong> to formulate our menu items as well as top-tier <em>customer service</em>. 
            We have a wide range of burgers, sides, drinks and deserts available to <u>satisfy</u> all our customers.
          </p>
          {settings?.noticeOn ?
          <>
            <h2 className={styles.noticeHdr}>Notice:</h2>
            <p className={styles.infoText}>{settings?.notice}</p>
          </>
            : null
          }
          <div>
            <h2 className={styles.noticeHdr}>
             Food Allergy?
            </h2>
            <p className={styles.infoText}>
              If you require information about a food allergy or intolerance, call BurgerBox at{" "}  
              <a style={{cursor:"pointer"}} 
                onClick={() => handlePhoneNumberAction("+441323899221")}
              >
                <strong>{phoneNumber}</strong>
              </a>
              . Please ensure you get the advice you need before ordering.
            </p>
          </div>
        </div>
    </div>
  )
}

export default About