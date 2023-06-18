import React from 'react'
import styles from '../../styles/order.module.css'
import axios from 'axios';
import OrderComp from '../../components/order-comp';
import { io } from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import { CheckOut } from "../../components/stripe"
import Alert from '../../components/alert';
import { useRouter } from 'next/router';
import useProductsList from '../../hooks/useProductsList';
import redirectWithQuery from '../../functions/redirect'

const Order = ({orderData, products, settings}) => {
  const router = useRouter();
  useEffect(()=> {
    if(!orderData){
      redirectWithQuery("/home", router)
    }
  },[orderData, router])

  const [order, setOrder] = useState(orderData)
  const [width, setWidth] = useState()
  const fries = products.find((product) => 
  product.title === "Fries" && product.location === router.query.location);
  const productsList = useProductsList(order, products, fries);
  const [alert, setAlert] = useState(false);
  const [alertDetails, setAlertDetails] = useState({
    header: null,
    message: null,
    type: null,
    onClose: ()=>setAlert(false),
    onConfirm: null,
  })
  const discountTotal = order.total - order.discount;
  const total = order.deliveryCost ? 
    (order.deliveryCost + discountTotal).toLocaleString("en-US", {style: "currency", currency: "GBP"}) 
    : discountTotal.toLocaleString("en-US", {style: "currency", currency: "GBP"})
  const success = router.query.success !== "false";

  
  useEffect(() => {
    handleWidth()
    window.addEventListener("resize", handleWidth)
  }, [])
  
  const handleWidth = () => {
    setWidth(window.innerWidth)
  }

  const socket = useRef(null);

  useEffect(() => {
    const handleResponse = (res) => {
      if (res.id === order._id || res.id === "all") {
        setOrder((prevOrder) => {
          const updatedOrder = { ...prevOrder };
          if (res.accepted) {
            updatedOrder.status = 2;
          } else if (!res.accepted) {
            updatedOrder.status = 0;
          }
          if (res.note) {
            updatedOrder.note = res.note;
          }
          if (res.deliveryTime && order.delivery) {
            updatedOrder.time = res.deliveryTime;
          }
          if (res.collectionTime && !order.delivery) {
            updatedOrder.time = res.collectionTime;
          }
          return updatedOrder;
        });
      }
    };
    const handleCompleted = (res) => {
      console.log('completed recieved');
      console.log(res);
      if ((res.id === order._id) || (res.id === "all" && res.location === order.location)) {
        setOrder((prevOrder) => ({
          ...prevOrder,
          status: 3,
        }));
      }
    };
    const socketInit = async () => {
      try {
        await fetch("/api/socket");
        socket.current = io();
        socket.current.on("connect", () => {
          console.log("Socket connected");
          socket.current.on("getResponse", handleResponse);
          socket.current.on("getCompleted", handleCompleted);
        });
      } catch (error) {
        console.error("Socket initialization error:", error);
      }
    };
    socketInit();
    return () => {
      if (socket.current) {
        socket.current.off("getResponse", handleResponse);
        socket.current.off("getCompleted", handleCompleted);
        socket.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [order._id, order.delivery, order.location]);

  
 
const checkoutF = () => {
  const details = {
    lineItems: productsList,
    id: order._id,
    email: order.details.email,
    location: router.query.location,
    applyDiscount: settings.discount.applied 
  }
  CheckOut(details)
}
  return (
    <div className={styles.container}>
      {alert ? <Alert {...alertDetails}/> : null}
     <div className={styles.inner_container}>
       <div className={styles.wrapper}>
        {order.status === 5 && width ?
        <>
         <h1 className={styles.hdr}>Please Check your order and click checkout</h1>
         </>
       : order.status === 1 ?
       <h1 className={styles.hdr}>Your order has been submitted to the restaurant</h1>
       : order.status === 2 ? 
       <h1 className={styles.hdr}>Your order is being prepared and will {order.delivery ? `arrive in` : " be ready for collection in"} {order.time} minutes.</h1>
       : order.status === 0 ? 
       <h1 className={styles.hdr}>Your order has been declined and funds will refunded to your account within 3-5 business days</h1>
       : order.status === 3  ?
       <h1 className={styles.hdr}>Your order is {order.delivery ? "out for delivery" : "ready for collection"}. Enjoy!</h1>
       : null}
           {!success ? <h2 className={styles.failed}>Your payement appears to have failed. Please check your payment method, rolad the page and try again.</h2> : null}
           <p className={styles.notice}>* Do not leave this page whilst order is in progress</p>
           <p className={styles.notice}>Please refresh the page after a short while if you haven&apos;t recived an expected update</p>
           {order.status === 5 ? 
           <>
           {settings.discount.active ? 
          <div className={styles.discountContainer}> 
            <h2 className={styles.discountMessage}>{settings.discount.message}</h2> 
          </div>
          :null}
           <button className={styles.btnCheckout} onClick={()=>checkoutF()}>Checkout</button> 
           </>
           :null}
           {order.note?.length >= 1 ?
       <>
       <h2 className={styles.note_hdr}>Order note:</h2>
        <p className={styles.note}>&quot;{note}&quot;</p>
        </> : null}
        <p className={styles.total} id={styles.total}>Total: {total}</p>
       </div>
       <OrderComp order={order} fries={fries} total={total}/>
       {order.status === 5 && width < 1024 ?
       <button className={styles.btnCheckout} onClick={()=>checkoutF()}>Checkout</button>
       : null}
     </div>
   </div>
    )
    

  }
  export const getServerSideProps = async (context) => {
    const { params, query, req } = context;
    const location = query.location;
    const myCookie = req?.cookies || "";

  let token = 
      location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
    : location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
    : null;

  if (myCookie.token === token){
    const locationQuery = {
      location: query?.location
    };
    const queryString = new URLSearchParams(locationQuery).toString();
  
    return {
      redirect: {
        destination: `/admin/orders?${queryString}`,
        permanent: false,
      },
    };
  }
  
    const locationFilter = {
      params: {
        location: location 
      }
    }

    const orderRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${params.id}`);
    const productsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
    const settingsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, locationFilter);
    
    return {
      props:{
        orderData: orderRes.data,
        products: productsRes.data,
        settings: settingsRes.data,
      }
    }
  };

export default Order;