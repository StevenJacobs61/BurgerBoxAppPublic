import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

export default function SettingsContextProvider({children}) {

  const [settings, setSettings] = useState({});
  const [width, setWidth] = useState();
  const [alert, setAlert] = useState(false);
  const [alertDetails, setAlertDetails] = useState({
    header: null,
    message: null,
    type: null,
    onClose: ()=>setAlert(false),
    onConfirm: null,
  })

  const handleWidth = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    setWidth(window.innerWidth)
    window.addEventListener("resize", handleWidth)
  }, [])


  return (
    <SettingsContext.Provider value={{settings, setSettings, width, alert, setAlert, alertDetails, setAlertDetails}}>
        {children}
    </SettingsContext.Provider>
    
  )
}

export function useSettings(){
    const settingsContext = useContext(SettingsContext);
    if(settingsContext === null){
        throw new Error("useSettings must be used within SettingsContextProvider")
    }
    return settingsContext;
}
