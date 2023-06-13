import React from 'react'
import styles from '../../../styles/item.module.css'
import { useState } from 'react';

const Item = ({order, setNote, handleData, settings, setTime}) => {

  const status = order.status
  const  [refundAm, setRefundAm] = useState(0)
  return (
    <>
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
        <div className={styles.item}><p className={styles.title}>Ordered: </p><p className={styles.info}>{order.createdAt.slice(0, 10)}  {order.createdAt.slice(11, 19)}</p></div>
       {order.updatedAt !== order.createdAt && <div className={styles.item}><p className={styles.title}>Updated: </p><p className={styles.info}>{order.updatedAt.slice(0, 10)}  {order.updatedAt.slice(11, 19)}</p></div>}
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
         <p className={styles.title}><strong>Total:</strong></p>
         <p className={styles.info}><strong>{order.delivery ? (order.total + order.deliveryCost - order.discount).toLocaleString("en-US", {style: "currency", currency: "GBP"}) : (order.total - order.discount).toLocaleString("en-US", {style: "currency", currency: "GBP"})}</strong></p>
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
   </>
  )
}

export default Item