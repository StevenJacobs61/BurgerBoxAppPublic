import axios from 'axios'
import styles from '../../styles/admin.module.css'
import ManageProducts from '../../components/admin/menu/manage-products'
import Item from '../../components/admin/orders/item'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import Settings from '../../components/admin/settings/settings'
import { setAdmin } from '../../redux/userSlice'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Alert from '../../components/alert'
import dbconnect from '../../utils/mongodb'
import Show from '../../components/show'


const Admin = ({productsList, admins, sectionsList, settings, admin, orders}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [alert, setAlert] = useState(false);
    const [alertDetails, setAlertDetails] = useState({
    header: null,
    message: null,
    type: null,
    onClose: ()=>setAlert(false),
    onConfirm: null,
  })
  
  useEffect(()=>{
    dispatch(setAdmin(admin))
  }, [dispatch, admin])

  // Get notifiations status from redux

  const cart = useSelector((state) => state.cart);
  const[showProducts, setShowProducts] = useState(true);
  const [showSettings, setShowSettings] = useState(true)
  const [newOrder, setNewOrder] = useState(null)
  const [show, setShow] = useState(false)
  const audio = useMemo(() => new Audio('/sounds/alert.mp3'), []);
  const socket = useRef(null);
  const [ordersList, setOrdersList] = useState(orders)
  const [settingsObj, setSettingsObj] = useState(settings)
  const [note, setNote] = useState();
  const [time, setTime] = useState();

  const showItem = useCallback((order) => {
    console.log("showing item");
    setNewOrder(order);
    console.log(newOrder);
    setShow(true);
    console.log(show);
  }, []);

  const handleNewOrder = useCallback(async (id) => {
    try {
      const orderRes = await axios.get(`/api/orders/${id}`);
      const foundOrder = orderRes.data;
  
      console.log("Order received");
      if (foundOrder) {
        console.log("found");
        if (cart.notifications) {
          console.log("notification on");
          showItem(foundOrder);
          if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
          }
          audio.play();
        }

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
  }, [cart.notifications, showItem, audio, setAlert, setAlertDetails]);
  
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
  
  useEffect(() => {
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);


  const handleData = (method, order) => {
    const id = order._id;
    if(method === "accept"){
      handleAccept(order)
    } else if(method === "decline"){
        handleDecline(id)
    }
  }

  const handleAccept = async (order) => {
    const id = order._id
    const delivery = order.delivery
    const newTime = time ? parseInt(time) : delivery ? settingsObj.delTime : settingsObj.colTime
    const newData = {
      status: 2,
      time: newTime,
      acceptedAt: new Date()
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
          location: router.query.location
        }
      });
      const settingsRes = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, {filter, update}, {
        params: {
          location: router.query.location
        },
      });
      setOrdersList(ordersList.map((item) => {
        if (item._id === id){
          item.status = 2;
          item.time = newTime,
          item.acceptedAt = new Date()
        } return item;
      }))
      const tSets = settingsObj;
      if(delivery){
        tSets.delTime = newTime
      }else{
        tSets.colTime = newTime
      }
      setSettingsObj(tSets)
      socket.current.emit("respond", {id, accepted: true, note, deliveryTime: newTime, collectionTime: newTime});
      console.log("response submitted");
      setNote()
      setTime()
      setShow(false);
      setNewOrder(null)
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
      status: 0
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
        setNewOrder(null)
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

    // Change meneu width style on expand

    const [width, setWidth] = useState();
    
    useEffect(() => {
      if(window.innerWidth >=1024) {
        setShowProducts(true)
        setShowSettings(true)
      }
      const handleWidth = () => {
        const w = window.innerWidth;
        if(w >=1024 && !showProducts || !showSettings){
          setShowProducts(true)
          setShowSettings(true)
        }
        setWidth(w)
      }
      window.addEventListener("resize", handleWidth)
    }, [showProducts, showSettings])

  return (
    <div className={styles.container}>
      {alert ? <Alert {...alertDetails}/> : null}
       <Head>
        <title>Burger Box Seaford</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/img/order-box.webp" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.page_hdr}>
        Admin
        </h1>
      <div className={styles.items_container} style={{margin: showProducts ? null : "2rem 0"}}>
          <div className={styles.item} style={{width: showSettings && width < 1024 ? "90%": null}}>
          <h1 className={styles.hdr}
          onClick={() => {if (window.innerWidth>=1024){null} else {setShowSettings(!showSettings)}}}>Settings</h1>
           {showSettings ? <Settings
           settingsList={settings}
           admins={admins}
           {...{setAlert, setAlertDetails}}/>
            : null}
          </div>
        <div className={styles.item} style={{width: showProducts && width < 1024 ? "90%" : null}}>
        <h1 className={styles.hdr}
        onClick={() => {if (window.innerWidth>=1024){null} else {setShowProducts(!showProducts)}}}>Menu</h1>
             {showProducts ?  <ManageProducts
         productsList={productsList}
         sectionsList={sectionsList}
         {...{setAlert, setAlertDetails}}
         /> : null}
            </div>
      </div> 
        {show && newOrder ?
        <Show setShow={setShow}>
          <Item 
          handleData={handleData} 
          order={newOrder} 
          setShowItem={setShow} 
          status={newOrder.status}
          setNote={setNote}
          settings={settingsObj}
          setTime={setTime}/> 
        </Show>
        : null}
      </div>
    </div>
  )
  
}
export default Admin

export const getServerSideProps = async (ctx) => {
  const { req, query } = ctx;
  const location = query.location;
    const myCookie = req?.cookies || "";
    let admin = false
    let token = 
      location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
    : location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
    : null;
    if (myCookie.token !== token) {
      const queryString = new URLSearchParams(query).toString();
      return {
        redirect: {
          destination: `/admin/login?${queryString}`,
          permanent: false,
        },
      };
    } else{
      admin = true
    }

    const axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: myCookie.token
      },
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
    await dbconnect()

  const sectionsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sections`, locationFilter)
  const productsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, locationFilter)
  const settingsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, locationFilter)
  const adminRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin`, requestConfig)
  const ordersRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, requestConfig)

    return {
      props:{
            productsList: productsRes.data,
            admins: adminRes.data,
            sectionsList: sectionsRes.data, 
            settings: settingsRes.data,
            orders: ordersRes.data,
            admin
          }
      }
  } 
