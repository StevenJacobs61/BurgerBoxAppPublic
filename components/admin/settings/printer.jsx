import React from 'react'
import { useState, useRef } from 'react';
import styles from "../../../styles/printer/printer.module.css"
import InputField from "../../inputs/input_field"

const Printer = () => {
    const printerIP = useRef()
    const printerPort = useRef()
    const [connectionStatus, setConnectionStatus] = useState("");
  
    const ePosDevice = useRef();
    const printer = useRef();
  
    const STATUS_CONNECTED = "Connected";
  
    const connect = () => {
      setConnectionStatus("Connecting ...");
  
      if (!printerIP.current.value) {
        setConnectionStatus("Type the printer IP address");
        return;
      }
      if (!printerPort.current.value) {
        setConnectionStatus("Type the printer port");
        return;
      }
  
      setConnectionStatus("Connecting ...");
  
      let ePosDev = new window.epson.ePOSDevice();
      ePosDevice.current = ePosDev;
  
      ePosDev.connect(printerIP.current.value, printerPort.current.value, (data) => {
        if (data === "OK") {
          ePosDev.createDevice(
            "local_printer",
            ePosDev.DEVICE_TYPE_PRINTER,
            { crypto: true, buffer: false },
            (devobj, retcode) => {
              if (retcode === "OK") {
                printer.current.value = devobj;
                setConnectionStatus(STATUS_CONNECTED);
              } else {
                throw retcode;
              }
            }
          );
        } else {
          throw data;
        }
      });
    };
  
    const print = (text) => {
      let prn = printer.current.value;
      if (!prn) {
        alert("Not connected to printer");
        return;
      }
  
      prn.addText(text);
      prn.addFeedLine(5);
      prn.addCut(prn.CUT_FEED);
  
      prn.send();
    };
  return (
    <div className={styles.container}>
      <h2 className={styles.hdr}>Status: {connectionStatus}</h2>
      <div className={styles.input_container}>
      <InputField type={"text"} plHolder={"Printer IP Address"} cRef={printerIP}/>
      </div>
      <div className={styles.input_container}>
      <InputField type={"number"} plHolder={"Printer Port"} cRef={printerPort}/>
      </div>
      <div className={styles.btn_container}>
    <button
    className={styles.btn_connect}
      disabled={connectionStatus === STATUS_CONNECTED}
      onClick={() => connect()}
    >
      Connect
    </button>
    <button
    className={styles.btn_print}
      disabled={connectionStatus !== STATUS_CONNECTED}
      onClick={() => print(textToPrint)}
    >
      Print
    </button>
      </div>
  </div>
  )
}

export default Printer