import React, { useEffect } from 'react'
import styles from '../../../styles/item.module.css'
import { useState } from 'react';
import {usePrinter} from '../../../context/printerContext.js'
import {AiOutlinePrinter} from 'react-icons/ai'
import { DateTime } from "luxon";

const Item = ({order, setNote, handleData, settings, setTime, setAlert, setAlertDetails, time, alertDetails}) => {
 

  const printerContext = usePrinter();
  const [connectionStatus, setConnectionStatus] = useState(printerContext.connectionStatus);

  
  const handlePrinter = () => {
    if(time){
      order.time = parseInt(time);
    }
    if(printerContext.printer){
      // order.updatedAt = updatedTime;
      // order.createdAt = createdTime;
      // order.acceptedAt = acceptedTime;
      printerContext.handlePrint(order);
    }else{
      setAlertDetails({
        header: "Alert",
        message: 'Connecting...', 
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
      connectPrinter();
    }
  }

  const connectPrinter = async () => {
    
    const localIp = await localStorage.getItem('ip')
    if(!localIp && !printerContext.printer){
      setAlertDetails({
        header: "Alert",
        message: "Please enter printer IP address in settings in order to use printer.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
    }else{
      if(!printerContext.printer){
        try {
          await printerContext.handleConnect(localIp);
          } catch (error) {
            setAlertDetails({
              header: "Alert",
              message: "There was an error connecting the printer.",
              type: "alert",
              onClose: ()=>setAlert(false),
              onConfirm: null,
            });
            setAlert(true)
          }
        }
      }
    }
  useEffect(()=>{

    if(printerContext.connectionStatus === "Connected" && alertDetails.message === "Connecting..."){
      setAlert(false);
    }

  }, [printerContext.connectionStatus])
  useEffect(()=>{
    connectPrinter();
  }, [printerContext.printer]);

  const [newDate, setNewDate] = useState();
  const [newTime, setNewTime] = useState();

  useEffect(()=>{
    if(!printerContext.printer){
      connectPrinter();
    }
    const dateTime = new Date(order.acceptedAt);
    dateTime = DateTime.fromJSDate(dateTime);
  const newDateTime = dateTime.plus({ minutes: order.time });
  console.log(newDateTime);
  setNewDate(newDateTime.toFormat('yyyy-MM-dd'));
  setNewTime(newDateTime.toFormat('HH:mm'));
  }, []);

  const status = order.status;
  const  [refundAm, setRefundAm] = useState(0);

  const acceptedTime = new Date(order.acceptedAt).toLocaleString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/London",
  });
  
  const updatedTime = new Date(order.updatedAt).toLocaleString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/London",
  });
  const createdTime = new Date(order.createdAt).toLocaleString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/London",
  });

  return (
    <div className={styles.container}>
            <h1 className={styles.hdr}>
                {order.status === 0 ? 'Declined Order' 
                : order.status === 1 ? 'New Order' 
                : order.status === 2 ? 'Active/Paid Order' 
                : order.status === 3 ? 'Completed Order' 
                : order.status === 4 ? 'Past Order'
                : "Waiting for payment"
                }
            </h1>
            {/* Buttons */}
        <div className={styles.btn_container}>
          {status === 1 ? null :
            <AiOutlinePrinter 
              className={styles.printer} 
              onClick={()=>handlePrinter()}
              style={{fill: !printerContext.printer ? 'red' : ''}}/>
          }
        {status === 0 ? 
            <button 
            className={styles.btn_del} 
            onClick={() => (handleData("delete", order))}>
             Delete
            </button>
            // Waiting for restaunt to accept
          :status === 1 ? 
            <>
              <button 
              className={styles.btn_accept} 
              onClick={() => (handleData("accept", order))}>
               Accept
              </button>
              <button 
              className={styles.btn_del} 
              onClick={() => handleData("decline", order)}>
               Decline
              </button>
            </>
            // Active order
            :status === 2 ?
            <button 
            className={styles.btn_complete} 
            onClick={() => handleData("complete", order)}>
              complete
            </button>
            // Completed order
            :status === 3 ? 
            <button 
            className={styles.btn_complete} 
            onClick={() => handleData("history", order)}>
             History
            </button>
            // Past order(4)/not paid(5)
            :status === 4  || status === 5 ? 
            <button 
            className={styles.btn_del} 
            onClick={() => handleDdata("delete", order)}>
             Delete
            </button>
            : null}
            </div>
         {order.status === 1 ? <div className={styles.input_container}>
            <label className={styles.label}>Set {order.delivery ? "delivery" : "collection"} time (mins):</label>
            <input type="number" step="1" min="1" className={styles.input} onChange={(e)=>setTime(e.target.value)}  defaultValue={order.delivery ? settings.delTime : settings.colTime}/>
          </div>: null}
    <div className={styles.details}>
        <div className={styles.item}><p className={styles.title}>ID: </p><p className={styles.info}>{order._id.slice(21, 24)}</p></div>
        <div className={styles.item}><p className={styles.title}>Method: </p><p className={styles.info}>{order.delivery ? 'Delivery' : 'Collection'}</p></div>
        <div className={styles.item}><p className={styles.title}>Ordered: </p><p className={styles.info}>{createdTime}</p></div>
       {order.updatedAt !== order.createdAt && <div className={styles.item}><p className={styles.title}>Updated: </p><p className={styles.info}>{updatedTime}</p></div>}
        <div className={styles.item}><p className={styles.title}>Due: </p><p className={styles.info}>{newTime}</p></div>
        <div className={styles.item}> <p className={styles.title}>Name: </p><p className={styles.info}>{order.details.name}</p></div>
       {order.delivery ? 
       <div className={styles.item}> 
       <p className={styles.title}>Address: </p>
       <p className={styles.info}>{order.details.address.street} <br /> 
       {order.details.address.postcode}</p>
       </div> : null}
       {order.delivery && order.details.address.instructions ?  
        <div className={styles.item}>
            <h3 className={styles.title}>Instructions:</h3>    
            <p className={styles.info}>{order.details.address.instructions}</p>
        </div>: null}
        {/* Order details */}
       <div className={styles.item}> <p className={styles.title}>Order: </p>
       <div>
           {order.orders.map((order) =>
               <div key={Math.random(1000)} className={styles.order_container}>
                   <p className={styles.info}>{order.product.title}</p>
                   <p className={styles.quantity}>X {order.quantity}</p>
                   <p className={styles.fries}>{order.fries ? 'With Fries' : null}</p>
                   {order.extraOptions.map((option) =>
                   <p key={Math.random(1000)}className={styles.option}>
                    {option.title}
                   </p>
                   )}
                   {order.extraUpgrades.map((upgrade) =>
                   <p key={Math.random(1000)} className={styles.upgrade} >
                    {upgrade.title}
                   </p>
                   )}
                   {order.note?.length >=1 ? 
                    <div className={styles.item}>
                      <p className={styles.title}>Note:</p>
                   <p className={styles.info}>
                    {order.note}
                   </p>
                   </div> : null}
               </div>
           )}
       </div>
       </div>
        <div className={styles.subtotal}>
         <p className={styles.title}>Cart Total:</p>
         <p className={styles.info}>{order.total.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</p>
        </div>
        {order.delivery ? <div className={styles.subtotal}>
         <p className={styles.title}>Delivery fee:</p>
         <p className={styles.info}>{order.deliveryCost ? order.deliveryCost.toLocaleString("en-US", {style: "currency", currency: "GBP"}) : "Free"}</p>
        </div>: null}
        {order.discount ? <div className={styles.subtotal}>
         <p className={styles.title}>Discount:</p>
         <p className={styles.info}>-{order.discount.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</p>
        </div>: null}
        <div className={styles.total}>
         <p className={styles.title} style={{fontWeight: "400"}}>Total:</p>
         <p className={styles.info}>{order.delivery ? (order.total + order.deliveryCost - order.discount).toLocaleString("en-US", {style: "currency", currency: "GBP"}) : (order.total - order.discount).toLocaleString("en-US", {style: "currency", currency: "GBP"})}</p>
        </div>
        {status === 2 || status === 3 || status === 4 || status === 0 ?
        <div className={styles.refunded_container}>
          <p className={styles.refunded_title}>Refunded:</p>
           <p className={styles.refunded}>{status === 0 ? `£${order.total}` : order.refunded === 0 ? "No" : `£${order.refunded}`}</p>
        </div> : null}
        {status === 1 ?<textarea className={styles.textarea} maxLength="150" 
        placeholder="Write note here.."
        onChange={(e) => setNote(e.target.value)}
        />
        :null}
    </div>

      {/* Refund */}
    {status === 2 || status === 3 || status === 4 ?
      <div className={styles.refund_wrapper}>
        <h3 className={styles.refund_hdr}>Refund</h3>
        <p className={styles.refund_warning_text}>* Default amount is the order total.</p>
        <h4 className={styles.refund_text}>Amount to refund</h4>
        <input className={styles.refund_input} onChange={(e) => setRefundAm(e.target.value)} type="number" defaultValue={order.total} placeholder={order.total}/>
        <button className={styles.btn_refund} 
        onClick={()=> handleData("refund", order, refundAm)} 
        >Refund</button>
    </div> 
    : null}
   </div>
  )
}

export default Item