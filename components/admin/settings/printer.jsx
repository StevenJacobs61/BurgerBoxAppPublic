import React, { useEffect, useState } from 'react'
import {useRef } from 'react';
import styles from "../../../styles/printer/printer.module.css"
import InputField from "../../inputs/input_field"
import { usePrinter } from '../../../context/printerContext';

const Printer = () => {
  const printerIPRef = useRef();
  const printerContext = usePrinter();

  const connectToPrinter = () => {
    const ipAddress = printerIPRef.current.value;
    localStorage.setItem('ip', ipAddress)
    printerContext.handleConnect(ipAddress);
  }

  const [localIp, setLocalIp] = useState(null);
  useEffect(()=>{
    const localStore = localStorage.getItem('ip')
    if(localStore){
      setLocalIp(localStore)
    }
  }, [])
  
  console.log(localIp);
  return (
    <div className={styles.container}>
      <h2 className={styles.hdr}>Status: {printerContext.connectionStatus}</h2>
      <div className={styles.input_container}>
      <InputField type={"text"} plHolder={"Printer IP Address"} cRef={printerIPRef} def={localIp && localIp}/>
      </div>
      {/* <div className={styles.input_container}>
      <InputField type={"number"} plHolder={"Printer Port"} cRef={printerPort}/>
      </div> */}
      <div className={styles.btn_container}>
    <button
    className={styles.btn_connect}
      disabled={printerContext.connectionStatus === 'Connected'}
      onClick={() => connectToPrinter()}
    >
      Connect
    </button>
    {/* <button
    className={styles.btn_print}
      disabled={printerContext.connectionStatus !== 'Connected'}
      onClick={() => handlePrint()}
    >
      Print
    </button> */}
      </div>
  </div>
  )
}

export default Printer