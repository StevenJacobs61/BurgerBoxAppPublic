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

const Order = ({orderData, products}) => {
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
  const total = order.deliveryCost ? 
    (order.deliveryCost + order.total).toLocaleString("en-US", {style: "currency", currency: "GBP"}) 
    : order.total.toLocaleString("en-US", {style: "currency", currency: "GBP"})
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
  }, []);

  const handleResponse = (res) => {
    console.log(res);
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
const checkoutF = () => {
  const id = order._id;
  const email = order.details.email;
  const location = router.query.location;
  CheckOut({lineItems: productsList}, id, email, location)
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
           {order.status === 5 ? <button className={styles.btnCheckout} onClick={()=>checkoutF()}>Checkout</button> :null}
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
  export const getServerSideProps = async ({params}) => {

    const orderRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${params.id}`);
    const productsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
    
    return {
      props:{
        orderData: orderRes.data,
        products: productsRes.data,
      }
    }
  };

export default Order;