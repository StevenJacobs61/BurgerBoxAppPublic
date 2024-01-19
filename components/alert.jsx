import React from 'react'
import styles from '../styles/alert.module.css'
import { useAlert } from '../context/alertContext';

const Alert = () => {
  const {alertDetails} = useAlert();
  const {header, message, type, onClose, onConfirm} = alertDetails;
  const handleConfirm = () => {
    onConfirm(); 
    onClose(); 
  };

  return (
    <div className={styles.container}>
        <div className={styles.messageContainer}>
            <h1 className={styles.hdr}>{header}</h1>
            <p className={styles.message}>{message}</p>
            {type === "alert" ? 
            <button className={styles.btnClose} onClick={()=>onClose()}>Close</button>
        : 
        <div className={styles.btnContainer}>
            <button className={styles.btnConfirm} onClick={()=>handleConfirm()}>Confirm</button>
            <button className={styles.btnClose} onClick={()=>onClose()}>close</button>
        </div>
        }
        </div>
    </div>
  )
}

export default Alert