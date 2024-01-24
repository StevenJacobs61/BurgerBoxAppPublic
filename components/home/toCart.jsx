import React from 'react'
import { useSettings } from '../../context/settingsContext';
import styles from '../../styles/menu.module.css'
import { GiShoppingCart } from 'react-icons/gi';
import { useOrder } from '../../context/orderContext';

export default function ToCart() {

    const {settings, width} = useSettings();
    const {total} = useOrder();

  return (
    width > 768 ? 
        <div className={styles.checkout}>
            {!settings.offline ? 
                <>
                    <button 
                        className={styles.basketButton} 
                        onClick={async () => await redirectWithQuery("/cart", router)}>
                        <GiShoppingCart width={100} height={100}/>
                    </button>
                    <p className={styles.text}>
                        Total:{" "}
                        {total?.toLocaleString("en-US", {style: "currency", currency: "GBP"})}
                    </p>
                </> 
            : 
                <p className={styles.offline}>Offline</p>
            } 
        </div> 
     : null
  )
}
