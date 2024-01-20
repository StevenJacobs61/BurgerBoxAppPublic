import { createContext, useContext, useState } from "react";

const SettingsContext = createContext(null);

export default function SettingsContextProvider({children}) {

    const [settings, setSettings] = useState({});
  return (
    <SettingsContext.Provider value={{settings, setSettings}}>
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
