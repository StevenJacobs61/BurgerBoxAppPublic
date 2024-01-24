import React from 'react'
import styles from "../../styles/home/location.module.css"
import Link from 'next/link'
import {GiHamburger} from 'react-icons/gi';
import { locations } from '../../data/locations';
import { useRouter } from 'next/router';

const Location = () => {
    const router = useRouter()
    const location = router.query.location

  return (
    <div className={styles.container}>
        <h1 className={styles.hdr}>our stores</h1>
            <div className={styles.storesContainer}>
                {locations.map((l, i)=>
                <div key={i} className={styles.storeContainer}>
                    <h2 
                    className={styles.storeTitle}
                    style={{color: l.title === location ? "var(--bg-color--blue)" : ""}}
                    >{l.title}</h2>
                    <Link href={l.link}>
                <div className={styles.iconContainer}>
                    <GiHamburger className={styles.icon}
                    style={{fill: l.title === location ? "var(--bg-color--blue)" : ""}}/>
                </div>
                    </Link>
                </div>
                )}
            </div>
    </div>
  )
}

export default Location