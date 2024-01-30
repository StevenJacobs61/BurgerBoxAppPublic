import React, { createContext, useContext, useEffect, useState } from 'react';
import { connect, callback_connect, createData, send, maintainConnection } from '../functions/connectPrinter';

const PrinterContext = createContext();

export function usePrinter() {
  return useContext(PrinterContext);
}

export function PrinterProvider({ children }) {
  const [printer, setPrinter] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('');

  const handleConnect = async (ipAddress) => {
    if(printer instanceof epson.ePOSDevice) return
    try {
      const ePosDev = await new epson.ePOSDevice();

      await connect(ePosDev, ipAddress, setConnectionStatus, (resultConnect) => {
        callback_connect(ePosDev, setConnectionStatus, (deviceObj) => {
          setPrinter(deviceObj);
        }, resultConnect);
      });

      await maintainConnection(ePosDev, ipAddress, setConnectionStatus, setPrinter);

    } catch (error) {
      console.error(error)
    }
  };

// async function printing(){
//   printer.addText('Test');
//   printer.addFeedLine(2)
//   printer.addCut(printer.CUT_FEED)
//   printer.send();
// }
  const handlePrint = async (data) => {
    try {

      // await printing()
      await createData(printer, data);
      await createData(printer, data);
    } catch (error) {
      console.error(error);
    }
  };

  const prepareToConnect = () => {
    const localIp = location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_IP 
              : process.env.NEXT_PUBLIC_SEAFORD_IP
    handleConnect(localIp);
  }

  useEffect(() => {

      const script = document.createElement('script');
      script.src = '/epos-2.23.0.js';
      script.async = true;
      
      script.onload = () => {
        prepareToConnect();
  
      }

      document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  return (
  <>
    <PrinterContext.Provider value={{ printer, connectionStatus, handleConnect, handlePrint }}>
      {children}
    </PrinterContext.Provider>
  </>
  );
}
