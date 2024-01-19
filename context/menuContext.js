import { createContext, useContext, useState } from "react";

const MenuContext = createContext(null);

export default function MenuContextProvider({children}) {

    const [sections, setSections] = useState([]);
    const [products, setProducts] = useState([])

  return (
    <MenuContext.Provider value={{sections, setSections, products, setProducts}}>
        {children}
    </MenuContext.Provider>
    
  )
}

export function useMenu(){
    const menuContext = useContext(MenuContext);
    if(menuContext === null){
        throw new Error("useMenu must be used within MenuContextProvider")
    }
    return menuContext;
}
