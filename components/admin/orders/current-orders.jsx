import React from 'react'
import styles from '../../../styles/current-orders.module.css'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { io } from 'socket.io-client'
import ListItem from './list-item'
import axios from 'axios'
import Item from '../orders/item'
import { useSelector } from 'react-redux'
import Show from '../../show'
import { useRouter } from 'next/router'

const CurrentOrders = ({orders, sets, setAlert, setAlertDetails}) => {

  const router = useRouter()
  const [settings, setSettings] = useState(sets)
  const [time, setTime] = useState(null)
  const location = router.query.location;
  const[sectionShow, setSectionShow] = useState([]);
  const [orderSections, setOrderSections] = useState([1,2,3,4,0])
  const [ordersList, setOrdersList] = useState(orders)
  const [note, setNote] = useState()
  const [notifications, setNotifications] = useState();
  const [show, setShow] = useState(false);
  const [newOrder, setNewOrder] = useState(null);
  const audio = useMemo(() => new Audio('/sounds/alert.mp3'), []);
  const cart = useSelector((state) => state.cart);
  const socket = useRef(null);


  const handleSectionShow = (section) => {
   const match = sectionShow.some((sect) => section === sect)
   if(match){
    setSectionShow(sectionShow.filter((sect) => sect !== section))
   }else{
    setSectionShow((prev) => ([...prev, section]))
   }
  }
 
  // Mute
  useEffect(() => {
    setNotifications(cart.notifications)
  }, [cart.notifications])

  // Update orders list every 30 mins
  useEffect(() => {
    const fetchOrders = async () => {
      const axiosConfig = {
        withCredentials: true,
      };
      const locationFilter = {
        params: {
          location: location 
        }
      }
      const requestConfig = {
        ...axiosConfig,
        ...locationFilter,
      };
      try {
        const allOrdersRes = await axios.get(`/api/orders`, requestConfig);
        const allOrders = allOrdersRes.data;
        setOrdersList(allOrders);
      } catch (error) {
        console.error(error);
        setAlertDetails({
          header: "Alert",
          message: "There was an issue updating the orders list. Please reload the page.",
          type: "alert",
          onClose: ()=>setAlert(false),
          onConfirm: null,
        });
        setAlert(true);
        return;
      }
    };
  
    const intervalId = setInterval(fetchOrders, 30 * 60 * 1000);
  
    return () => {
      clearInterval(intervalId);
    };
  }, [location, setAlert, setAlertDetails]);
  
  const showItem = useCallback((order) => {
    setNewOrder(order);
    setShow(true);
  }, []);
  
  const handleNewOrder = useCallback(async (id) => {
    try {
      const orderRes = await axios.get(`/api/orders/${id}`);
      const foundOrder = orderRes.data;
  
      console.log("Order received");
      if (foundOrder) {
        if (notifications) {
          showItem(foundOrder);
          if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
          }
          audio.play();
        }

        // If need to catch missed orders, then update ordersList on every order below

        // const axiosConfig = {
        //   withCredentials: true,
        // };
        // const locationFilter = {
        //   params: {
        //     location: location 
        //   }
        // }
        // const requestConfig = {
        //   ...axiosConfig,
        //   ...locationFilter,
        // };
      //   // Fetch all orders and update the state
      // const allOrdersRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, requestConfig);
      // const allOrders = allOrdersRes.data;
      // setOrdersList(allOrders);

      // If inefficiencies then use this rather than api calls each time.

        setOrdersList((prev) => {
          const orderExists = prev.some((order) => order._id === foundOrder._id);
          if (!orderExists) {
            return [...prev, foundOrder];
          }
          return prev; 
        });
      }
    } catch (error) {
      console.error(error);
      setAlertDetails({
        header: "Alert",
        message: "There was an issue recieving an order. Please reload the page.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
      return;
    }
  }, [notifications, showItem, audio, setAlert, setAlertDetails]);
  
  
  useEffect(() => {
    const socketInit = async () => {
      try {
        await fetch(`/api/socket`);
        socket.current = io();
  
        socket.current.on('connect', () => {
          console.log("Socket connected");
          socket.current.on("getNewOrder", handleNewOrder);
        });
      } catch (error) {
        console.error("Socket initialization error:", error);
        setAlertDetails({
          header: "Alert",
          message: "There was an issue connecting to customers. Please reload the page.",
          type: "alert",
          onClose: ()=>setAlert(false),
          onConfirm: null,
        });
        setAlert(true);
        return;
      }
    };
  
    socketInit();
  
    return () => {
      if (socket.current) {
        socket.current.off("getNewOrder", handleNewOrder);
        socket.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [handleNewOrder, setAlert, setAlertDetails]);
  
  useEffect(() => {
    if (newOrder) {
      showItem(newOrder);
    }
  }, [newOrder, showItem]);
  
  // Additional useEffect for audio cleanup
  useEffect(() => {
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);


  // MONGOOSE API CALL FUNCTIONS

  // status: 
  // 0 = Declined
  // 1 = Active/Paid
  // 2 = Completed
  // 4 = History
  // 5 = Waiting payment

  // Accept and Decline, ListItem prop
  const handleData = (method, order, refundAm) => {
    const id = order._id;
    if(method === "accept"){
      handleAccept(order)
    } else if(method === "decline"){
        handleDecline(id)
    } else if(method === "complete"){
      handleComplete(order)
    } else if(method === "delete"){
      handleDelete(id)
    } else if(method === "history"){
      handleHistory(id)
    } else if(method === "refund"){
      handleRefund(order, refundAm)
    }
  }
  const handleAccept = async (order) => {
    const id = order._id
    const delivery = order.delivery
    const newTime = time ? parseInt(time) : delivery ? settings.delTime : settings.colTime
    const newData = {
      status: 2,
      time: newTime,
      acceptedAt: new Date(),
      note:note
    }
    const update = {}
    if(delivery){
      update.delTime = newTime
    } else {
      update.colTime = newTime
    }
    const filter = {
      location: router.query.location
    };
    try{
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/` + id, newData, {
        params:{
          location: location
        }
      });
      const settingsRes = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, {filter, update}, {
        params: {
          location: location,
        },
      });
      setOrdersList(ordersList.map((item) => {
        if (item._id === id){
          item.status = 2;
          item.time = newTime,
          item.acceptedAt = new Date()
        } return item;
      }))
      const tSets = settings;
      if(delivery){
        tSets.delTime = newTime
      }else{
        tSets.colTime = newTime
      }
      setSettings(tSets)
      socket.current.emit("respond", {id, accepted: true, note, deliveryTime: newTime, collectionTime: newTime});
      console.log("response submitted");
      setNote()
      setTime()
      setShow(false);
    }catch(err){
      console.log(err);
      setAlertDetails({
        header: "Alert",
        message: "There was an error accepting this order. Please reload the page and check refund status.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
        });
        setAlert(true);
        return;
    }
  }
// Complete
  const handleComplete = async (order) => {
    const id = order._id;
    const newData = {
      status: 3
    }
  try{
    const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/` + id, newData, {
      params:{
        location: location
      }
    })
    setOrdersList(ordersList.map((item) => {
      if (item._id === id){
        item.status = 3;
        order = item;
      } return item;
    }));
    setShow(false);
    socket.current.emit("completed", {id})
  }catch(err){
      console.log(err);
      setAlertDetails({
        header: "Alert",
        message: "There was an error completing this order. Please reload the page and check refund status.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
        });
        setAlert(true);
        return;
  }
  }

  // Decline and refund full

  const handleDecline = async (id) => {
    setAlertDetails({
      header: "Are you sure?",
      message: "Please confirm you would like to decline this order.",
      type: "confirm",
      onClose: ()=>setAlert(false),
      onConfirm: ()=>decline(id),
    });
    setAlert(true);
  }
  const decline = async (id) => {
    const newData = {
      status: 0,
      note:note
    }
    let success = false;
    let amount = 0;
    const location = router.query.location;
    try {
      const refund = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/refund`, {id, amount, location})
      success = refund.data.success
    } catch (error) {
    console.log(error);
    setAlertDetails({
      header: "Alert",
      message: "There was an issue declining this order and the refund may not have been unsuccessful. Please reload the page and try again.",
      type: "alert",
      onClose: ()=>setAlert(false),
      onConfirm: null,
    });
    setAlert(true);
    return;
    }
    if(success){
      try{
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/` + id, newData, {
          params:{
            location: location
          }
        })
        setOrdersList(ordersList.map((item) => {
        if (item._id === id){
          item.status = 0;
        } return item;
        }))
        socket.current.emit("respond", {id, accepted: false, note});
        setShow(false);
        setNote();
      }catch(err){
        console.log(err);
        setAlertDetails({
        header: "Alert",
        message: "There was an error updating this order. Please reload the page and check refund status.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
        });
        setAlert(true);
        return;
      }
    }
    if (!success){
      setAlertDetails({
        header: "Alert",
        message: "There was an error refunding this order. Please reload the page and try again.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
      return;
    };
  };

  // REFUND certain amount

  const handleRefund = async (order, amount) => {
    if(total < amount){
      setAlertDetails({
        header: "Alert",
        message: "The amount to refund must be less or equal to the order total. Please enter a valid amount to refund.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
      return;
    }else{
      setAlertDetails({
        header: "Are you sure?",
        message: "Please confirm you would like to refund this order.",
        type: "confirm",
        onClose: ()=>setAlert(false),
        onConfirm: ()=>refund(order, amount),
      });
      setAlert(true);
    }
  }
  const refund = async (order, amount) => {
    amount = parseInt(amount) * 100
    const total = order.total
    total = total * 100
    const id = order._id
    let success = false;
    const location = router.query.location;
    try {
      const refund = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/refund`, {id, amount, location})
      success = refund.data.success
    } catch (error) {
      console.log(error);
      setAlertDetails({
      header: "Alert",
      message: "Refund was unsuccessful. Please reload the page and try again.",
      type: "alert",
      onClose: ()=>setAlert(false),
      onConfirm: null,
    });
    setAlert(true);
    return;
    }
    if(success){
        setShow(false)
        const refundAmount = amount/100;
        if(!amount){
          refundAmount = order.total
        }
        const newRefunded = order.refunded + refundAmount;
        if(newRefunded > order.total){
          newRefunded = order.total
        }
        const data = {
          refunded: newRefunded
        }
        try{
          const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/` + id, data, {
            params:{
              location:router.query.location
            }
          }
          )
          setOrdersList(ordersList.map((ord) => {
            if(ord._id === id){
              ord.refunded = data.refunded
            } return ord;
          }))
        } catch (err){
          console.log(err);
          setAlertDetails({
            header: "Alert",
            message: "Order failed to update. Please reload the page and check refund status.",
            type: "alert",
            onClose: ()=>setAlert(false),
            onConfirm: null,
          });
          setAlert(true);
          return;
        }
      }
      if (!success){
        setAlertDetails({
          header: "Alert",
          message: "There was an error refunding this order. Please reload the page and try again.",
          type: "alert",
          onClose: ()=>setAlert(false),
          onConfirm: null,
        });
        setAlert(true);
        return;
      };
    }
  

   const handleDelete = async (id) => {
    setAlertDetails({
      header: "Are you sure?",
      message: "Please confirm you wish to delete this order.",
      type: "confirm",
      onClose: ()=>setAlert(false),
      onConfirm: ()=> deleteOne(id),
    });
    setAlert(true);
   }

  const deleteOne = async (id) => {
    try{
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/` + id, {
        params:{
          location: location
        }
      })
      setOrdersList(ordersList.filter((item) => item._id !== id));
      setShow(false);
    }catch(err){
      console.log(err);
      setAlertDetails({
        header: "Alert",
        message: "There was an error whilst deleting this order. Please reload the page and try again.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
      return;
    }
  }
  
  const handleHistory = async (id) => {
    const newData = {
      status: 4
    }
    try{
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/` + id, newData, {
          params:{
            location: location
          }
        })
        setOrdersList(ordersList.map((item) => {
        if(item._id === id){
          item.status = 4;
        } return item;
      }));
      setShow(false);
    }catch(err){
        console.log(err);
        setAlertDetails({
          header: "Alert",
          message: "There was an error whilst sending this order to history. Please reload the page and try again.",
          type: "alert",
          onClose: ()=>setAlert(false),
          onConfirm: null,
        });
        setAlert(true);
        return;
    }
  }
  // Accept all new orders
  const handleAcceptAll = async () => {
    const filterDelivery = {
      status: 1,
      location: location,
      delivery: true
    }
    const filterCollection = {
      status: 1,
      location: location,
      delivery: false
    }
    const updateDelivery = {
      status: 2,
      acceptedAt: new Date(),
      time: settings.delTime
    }
    const updateCollection = {
      status: 2,
      acceptedAt: new Date(),
      time: settings.colTime
    }
  try{
    const resDel = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {filterDelivery, updateDelivery}, {
      params:{
        location: location
      }
    })
    const resCol = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {filterCollection, updateCollection}, {
      params:{
        location: location
      }
    })
    setOrdersList(ordersList.map((item) => {
      if(item.status === 1){
        item.status = 2;
        item.acceptedAt = new Date();
      }
      if(item.delivery){
        item.time = updateDelivery.time
      } 
      if(!item.delivery){
        item.time = updateCollection.time
      } 
      return item;
    }));
    socket.current.emit("respond", {
      accepted: true, 
      id: "all", 
      note: null, 
      deliveryTime: updateDelivery.time, 
      collectionTime: updateCollection.time});
    setShow(false);
  }catch(err){
      console.log(err);
      setAlertDetails({
        header: "alert",
        message: "There was an error whilst accepting these orders. Please reload the page and try again.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
      return;
  }

  // Decline all new orders

  }
  const handleDeclineAll = async () => {
    setAlertDetails({
      header: "Are you sure?",
      message: "Please confirm you wish to decline these orders.",
      type: "confirm",
      onClose: ()=>setAlert(false),
      onConfirm: ()=> declineAll(),
    });
    setAlert(true);
  }

  const declineAll = async () => {
    const update = {
      status: 0
    }
    try {
      ordersList.map(async(ord)=> {
        if(ord.status === 1){
          const id = ord._id;
          const amount = 0;
        const refund = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/refund`, {id, amount, location})
        if(refund.data.success){
          const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/` + id, update, {
            params:{
              location: location
            }
          })
          setOrdersList(ordersList.map((item) => {
            if (item._id === id){
              item.status = 0;
            } return item;
            }))
          }
        }
      })     
      socket.current.emit("respond", {id: "all", accepted: false});
    } catch (error) {
      console.log(error);
      setAlertDetails({
        header: "Alert",
        message: "There was an error whilst declining these orders. Please reload the page and try again.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
      return;
    }
  }


  // Complete all active orders

  const handleCompleteAll = async () => {
    const filter = {
    status: 2,
    location: location
    }
    const update = {
    status: 3
    }
    try{
    const res = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {filter, update}, {
      params:{
        location: location
      }
    })
    setOrdersList(ordersList.map((item) => {
      if(item.status === 2){
        item.status = 3;
      } return item;
    }));
    socket.current.emit('completed', {id: "all", location})
    setShow(false);
    }catch(err){
    console.log(err);
    setAlertDetails({
      header: "Alert",
      message: "There was an error whilst completing these orders. Please reload the page and try again.",
      type: "alert",
      onClose: ()=>setAlert(false),
      onConfirm: null,
    });
    setAlert(true);
    return;
    }
  }

  // Delete all past or declined orders

  const handleDeleteAll = async (orderSection) => {
    setAlertDetails({
      header: "Are you sure?",
      message: "Please confirm you wish to delete these orders.",
      type: "confirm",
      onClose: ()=>setAlert(false),
      onConfirm: ()=> deleteAll(orderSection),
    });
    setAlert(true);
  }

  const deleteAll = async (orderSection) => {
    const filter = {
      status: orderSection,
      location: location
    }
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {
      params: {
        location: location
      },
      data: filter
    });
  setOrdersList(ordersList.filter((item) => item.status !== orderSection));
  setShow(false);
  } catch (error) {
  console.log(error);
  setAlertDetails({
    header: "Alert",
    message: "There was an error whilst deleting these orders. Please reload the page and try again.",
    type: "alert",
    onClose: ()=>setAlert(false),
    onConfirm: null,
  });
  setAlert(true);
  return;
  };
  };

  // Send to past all completed orders

  const handleSendPastAll = async () => {
  const filter = {
  status: 3,
  location: location
  }
  const update = {
  status: 4
  }
  try{
  const res = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {filter, update}, {
    params:{
      location: location
    }
  })
  setShow(false)
  setOrdersList(ordersList.map((item) => {
    if(item.status === 3){
      item.status = 4;
    } return item;
  }));
  setShow(false);
  }catch(err){
  console.log(err);
  setAlertDetails({
    header: "Alert",
    message: "There was an error whilst sending these orders to history. Please reload the page and try again.",
    type: "alert",
    onClose: ()=>setAlert(false),
    onConfirm: null,
  });
  setAlert(true);
  return;
  }
  }

  return (
    <div className={styles.container}>
        <h1 className={styles.hdr} style={{margin: sectionShow.some((s)=> s === 1) ? null : "0 0 2.5rem"}}>Orders</h1>
         {orderSections.map((orderSection) =>
       <div className={styles.sections_container} key={orderSection}>
          <div className={styles.title_container}>
          <h1 className={styles.title_hdr} onClick={()=>handleSectionShow(orderSection)}>{
            orderSection === 0 ? "Declined " :
            orderSection === 1 ? "New " :
            orderSection === 2 ? "Active " :
            orderSection === 3 ? "Completed " :
            orderSection === 4 ? "History" :
            null} 
            {orderSection === 4 ? null : "Orders"}</h1>
            {orderSection === 0 &&  <button className={styles.btn_clear} onClick={()=>handleDeleteAll(orderSection)}>Delete</button>}
            {orderSection === 1 && <div className={styles.btn_all_container}>
              <button className={styles.btn_accept_all} onClick={handleAcceptAll}>Accept</button>
              <button className={styles.btn_decline_all} onClick={handleDeclineAll}>Decline</button>
            </div>}
            {orderSection === 2 &&   <button className={styles.btn_clear} onClick={handleCompleteAll}>complete</button>}
            {orderSection === 3 && <button className={styles.btn_clear} onClick={handleSendPastAll}>History</button>}
            {orderSection === 4 &&  <button className={styles.btn_clear} onClick={()=>handleDeleteAll(orderSection)}>Delete</button>}
            </div>
            {sectionShow.some((sect) => sect === orderSection) ? <table className={styles.table}>
            <tbody>
              <tr className={styles.tr}>
                <th>ID</th>
               {orderSection === 2 ? <th className={styles.tr_hdr}>timer <br/> (mins)</th> : null}
                <th className={styles.tr_hdr}>order</th>
                <th className={styles.tr_hdr}>Action</th>
              </tr>
            </tbody>
            {orderSection === 2 ? ordersList?.filter((order) => order.status === orderSection).sort((a, b) => {
              const aTotalTime = new Date(a.acceptedAt).getTime() + (a.time * 60000);
              const bTotalTime = new Date(b.acceptedAt).getTime() + (b.time * 60000); 
              return aTotalTime - bTotalTime; 
            })
            .map((item, i) => 
            <ListItem key={Math.random(1000)} 
            order={item} 
            showItem={showItem}
           handleData={handleData}
            />
            ) :
            ordersList?.filter((order) => order.status === orderSection)
            .map((item) => 
            <ListItem key={Math.random(1000)} 
            order={item} 
            showItem={showItem}
           handleData={handleData}
            />
            )}
            </table> : null}
       </div>
         )}
         {show && newOrder ? 
         <Show setShow={setShow} >
           <Item 
           order={newOrder} 
           setNewOrder={setNewOrder} 
           handleData={handleData}
           setNote={setNote}
           settings={settings}
           setTime={setTime}
           /> 
         </Show>

       : null}
    </div>
  )
}

export default CurrentOrders

