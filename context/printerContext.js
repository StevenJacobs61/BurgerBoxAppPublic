import React, { createContext, useContext, useState } from 'react';
import { connect, callback_connect, createData, send, maintainConnection } from '../functions/connectPrinter';

const PrinterContext = createContext();

export function usePrinter() {
  return useContext(PrinterContext);
}

export function PrinterProvider({ children }) {
  const [printer, setPrinter] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('');

  const handleConnect = async (ipAddress) => {
    const ePosDev = new epson.ePOSDevice();
    connect(ePosDev, ipAddress, setConnectionStatus, (resultConnect) => {
      callback_connect(ePosDev, setConnectionStatus, (deviceObj) => {
        setPrinter(deviceObj);
        // Call maintainConnection here, after the initial connection is established
        maintainConnection(ePosDev, ipAddress, setConnectionStatus);
      }, resultConnect);
    });
  };

  const handlePrint = async (data) => {
    try {
      await createData(printer, data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PrinterContext.Provider value={{ printer, connectionStatus, handleConnect, handlePrint }}>
      {children}
    </PrinterContext.Provider>
  );
}
