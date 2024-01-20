import React, { createContext, useContext, useEffect, useState } from 'react'

const OrderContext = createContext(null);

export default function OrderContextProvider({children}) {

    const [quantity, setQuantity] = useState(0);
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);

    function getTotal(){
      let tempTotal = 0;
      const localData = JSON.parse(localStorage.getItem("Orders"));
      if(!localData || localData?.length < 1){
          localStorage.setItem("Orders", "[]");
          localStorage.setItem("quantity", "0");
          setTotal(0);
          return
      }
      localData.forEach((order) => tempTotal += order.price * order.quantity)
      setTotal(tempTotal);
      }
    useEffect(() => {
      function localOrders(){
        const localOrders = JSON.parse(localStorage.getItem("Orders"));
        if(!localOrders){
          localStorage.setItem("Orders", "[]");
          setOrders([]);
          return
        }
        setOrders(localOrders);
      }
      localOrders();
      getTotal();
    }, [])



    function addQuantity(q){
      if(q === 0){
        setQuantity(0)
        localStorage.setItem("quantity", "0")
        return
      }
      const newQuantity = quantity + q
      console.log(newQuantity);
      setQuantity(newQuantity);
      localStorage.setItem("quantity", `${newQuantity}`);
    }

  return (
    <OrderContext.Provider value={{
        addQuantity, 
        quantity, 
        setQuantity,
        orders,
        setOrders,
        total,
        setTotal,
        getTotal}}>
        {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
    const orderContext = useContext(OrderContext);
    if(orderContext === null){
        throw new Error("useOrder must be used within OrderContextProvider")
    }
    return orderContext;
}
