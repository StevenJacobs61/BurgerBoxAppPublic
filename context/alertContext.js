import { createContext, useContext, useState } from "react";

const AlertContext = createContext(null);

export default function AlertContextProvider({children}) {

    const [alert, setAlert] = useState(false);
    const [alertDetails, setAlertDetails] = useState({
      header: null,
      message: null,
      type: null,
      onClose: ()=>setAlert(false),
      onConfirm: null,
    })

  return (
    <AlertContext.Provider value={{alert, setAlert, alertDetails, setAlertDetails}}>
        {children}
    </AlertContext.Provider>
    
  )
}

export function useAlert(){
    const alertContext = useContext(AlertContext);
    if(alertContext === null){
        throw new Error("useAlert must be used within AlertContextProvider")
    }
    return alertContext;
}
