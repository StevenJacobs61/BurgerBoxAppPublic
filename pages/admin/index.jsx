import axios from 'axios'
import styles from '../../styles/admin.module.css'
import ManageProducts from '../../components/admin/menu/manage-products'
import Item from '../../components/admin/orders/item'
import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import Settings from '../../components/admin/settings/settings'
import { setAdmin } from '../../redux/userSlice'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Alert from '../../components/alert'
import dbconnect from '../../utils/mongodb'


const Admin = ({productsList, admins, sectionsList, settings, admin}) => {
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
const [notifications, setNotifications] = useState(cart.notifications);


// Show sections on click
  const[showProducts, setShowProducts] = useState(false);
  const [showSettings, setShowSettings] = useState(false)


// Websocket receive order notifications

const [newOrder, setNewOrder] = useState()
const [showItem, setShowItem] = useState(false)


const socket = useRef(null);
const socketInit = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/socket`);
    socket.current = io();
    socket.current.on('connect', () => {
      console.log("Socket connected");
    });
    socket.current.emit("hi", "hi");
  } catch (error) {
    console.error("Socket initialization error:", error);
  }
};
useEffect(() => {

  socketInit();

  // Cleanup function
  return () => {
    if (socket.current) {
      socket.current.disconnect();
      console.log("Socket disconnected");
    }
  };
}, [])

  useEffect(() => {
    const handleNewOrder = (data) => {
      console.log(data);
      if (notifications) {
        setNewOrder(data);
        setShowItem(true);
      }
      const audio = new Audio('../../../public/sounds/alert.mp3');
      audio.play();
    };
  
    if (!socket.current) {
      socketInit();
    }
    if(socket.current){
      socket.current.on("getNewOrder", handleNewOrder);
    }
  
    return () => {
      if (socket.current) {
        socket.current.off("getNewOrder", handleNewOrder);
      }
    };
  }, [socket, notifications, setNewOrder, setShowItem]);
  
  
  // Functions for managing pop up notificiations

  const [note, setNote] = useState();

  const handleAccept = async (id) => {
    const newData = {
      status: 5
    }
    try{
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/` + id, newData);
      socket.current.emit("respond", {id, res: true}, note);
      setShowItem(false);
    }catch(err){
      console.log(err);
      setAlertDetails({
        header: "Alert",
        message: "There was an error whilst accepting this order. Please reload the page and try again.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
      return;
    }
  }
    
  const handleDecline = async (id) => {
    const newData = {
      status: 0
    }
     try{
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/` + id, newData)
        socket.current.emit("respond", {id, res: false}, note);
      setShowItem(false)
      }catch(err){
         console.log(err);
         setAlertDetails({
          header: "Alert",
          message: "There was an error whilst declining this order. Please reload the page and try again.",
          type: "alert",
          onClose: ()=>setAlert(false),
          onConfirm: null,
        });
        setAlert(true);
        return;
     }}

     const handleComplete = async (id) => {
      const newData = {
        status: 3
      }
    try{
       const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/` + id, newData)
       setShowItem(false);
    }catch(err){
        console.log(err);
        setAlertDetails({
          header: "Alert",
          message: "There was an error whilst completing this order. Please reload the page and try again.",
          type: "alert",
          onClose: ()=>setAlert(false),
          onConfirm: null,
        });
        setAlert(true);
        return;
    }
    }

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
        <div className={styles.item} style={{width: showProducts && width < 1024 ? "90%" : null}}>
        <h1 className={styles.hdr}
        onClick={() => {if (window.innerWidth>=1024){null} else {setShowProducts(!showProducts)}}}>Menu</h1>
             {showProducts ?  <ManageProducts
         productsList={productsList}
         sectionsList={sectionsList}
         {...{setAlert, setAlertDetails}}
         /> : null}
            </div>
          <div className={styles.item} style={{width: showSettings && width < 1024 ? "90%": null}}>
          <h1 className={styles.hdr}
          onClick={() => {if (window.innerWidth>=1024){null} else {setShowSettings(!showSettings)}}}>Settings</h1>
           {showSettings ? <Settings
           settingsList={settings}
           admins={admins}
           {...{setAlert, setAlertDetails}}/>
            : null}
          </div>
      </div> 
        {showItem ? <Item 
        handleDecline={handleDecline} 
        handleAccept={handleAccept}
        handleComplete={handleComplete}
        order={newOrder} 
        setShowItem={setShowItem} 
        status={newOrder.status}
        setNote={setNote}/> 
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
    const queryString = new URLSearchParams(query).toString();
    if (myCookie.token !== process.env.NEXT_PUBLIC_TOKEN) {
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

    return {
      props:{
            productsList: productsRes.data,
            admins: adminRes.data,
            sectionsList: sectionsRes.data, 
            settings: settingsRes.data,
            admin
          }
      }
  } 
