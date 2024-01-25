import Image from 'next/image'
import React from 'react'
import { useSettings } from '../../context/settingsContext';
import styles from '../../styles/product.module.css'

export default function ProductInfo({product, available, price, productQuantity}) {

    const {settings} = useSettings();

  return (
    <div className={styles.left}>
    <div className={styles.img_container}>
        <Image 
            src="/img/cart.svg" 
            alt='Cart Photo' 
            width="70%" 
            height="70%" 
            className={styles.icon}
        />
    </div>
     <h1 className={styles.title}>
        {product.title}
    </h1>
     {settings.offline || !available ? 
        <h2 className={styles.offline}>
            Unavailable
        </h2> 
        : 
        <h2 className={styles.price}>
            Total: 
            {(Math.round(price * productQuantity * 100) / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: 'GBP',
            })}
        </h2>
    }
     <p className={styles.desc}>
        &quot;{product.desc}&quot;
    </p>
  </div>
  )
}
