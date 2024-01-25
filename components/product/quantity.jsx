import React from 'react'
import styles from '../../styles/product.module.css'

export default function Quantity({setProductQuantity}) {
  return (
    <div className={styles.quantity_container}>
          <h3 className={styles.extraToppingsHeader}>Quantity</h3>
          <input
            className={styles.quantity}
            type="number"
            placeholder="1"
            id="amount"
            name="amount"
            onChange={(e) => {
              const value = e.target.value;
              const parsedValue = parseInt(value);
              if (!isNaN(parsedValue) && parsedValue >= 1) {
                setProductQuantity(parsedValue);
              } else {
                setProductQuantity(1);
              }
            }}
            defaultValue="1"
            min="1"
          />
    </div>
  )
}
