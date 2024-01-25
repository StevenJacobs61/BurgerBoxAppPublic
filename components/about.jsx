import React from 'react'
import styles from '../styles/about.module.css'
import { useSettings } from '../context/settingsContext'
import { handlePhoneNumberAction } from '../functions/phoneNumber'
import StoreInfo from './home/storeInfo'
import redirectWithQuery from '../functions/redirect'
import { useRouter } from 'next/router'

const About = () => {

  const {settings} = useSettings();
  const phoneNumber = '+44132389921';
  const router = useRouter();

  return (
    <div className={styles.container}>
          <h1 className={styles.hdr}>About BurgerBox</h1>
        <p className={styles.text}>Open 3.30pm - 10pm. Closed Tuesdays </p>
        <div className={styles.contentContainer}>

        <div className={styles.leftContainer}>
          <div className={styles.leftSection}>
          <p className={styles.infoText}>
           <strong>BurgerBox</strong>  is a brand that <u>prides</u> itself on offering the <em>best quality beef smash patty burgers</em>  and unique menu options all-round. We provide <strong>quality ingredients</strong> to formulate our menu items as well as top-tier <em>customer service</em>. 
            We have a wide range of burgers, sides, drinks and deserts available to <u>satisfy</u> all our customers.
          </p>
          </div>

          {settings?.noticeOn ?
          <div className={styles.leftSection}>
            <h2 className={styles.noticeHdr}>Notice:</h2>
            <p className={styles.infoText}>{settings?.notice}</p>
          </div>
            : null
          }

          <div className={styles.leftSection}>
            <h2 className={styles.noticeHdr}>
             Food Allergy?
            </h2>
            <p className={styles.infoText}>
              If you require information about a food allergy or intolerance, call BurgerBox at{" "}  
              <a style={{cursor:"pointer"}} 
                onClick={() => handlePhoneNumberAction(phoneNumber)}
              >
                <strong>{phoneNumber}</strong>
              </a>
              . Please ensure you get the advice you need before ordering.
            </p>
          </div>

        </div>
        <div className={styles.rightContainer}>
          <div className={styles.leftSection}>
            <h2 className={styles.noticeHdr}>Want to franchise?</h2>
            <p 
            onClick={async()=> await redirectWithQuery("/franchise", router)} 
            className={styles.infoText}
            style={{cursor: "pointer"}}
            >
              If you want to inquire about how to join our BurgerBox family, get in touch <u>here!</u>
            </p>
          </div>
          <div className={styles.leftSection}>
          <StoreInfo/>
          </div>
        </div>
        </div>
    </div>
  )
}

export default About