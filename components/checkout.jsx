import React, { useState, useEffect, useRef } from 'react'
import styles from '../styles/checkout.module.css'
import { useRouter } from 'next/router';
import axios from 'axios';
import redirectWithQuery from "../functions/redirect"
import Alert from './alert';
import { useSettings } from '../context/settingsContext';
import { useAlert } from '../context/alertContext';
import { useOrder } from '../context/orderContext';
import verifySeafordPostcode from '../functions/verifyPostcode';
import Details from './details';
import handleDeliveryCosts from "../functions/deliveryCosts"
import DeliveryCostsDetails from "./deliveryCostsDetails"


const Checkout = () => {

  const router = useRouter();
  const { settings } = useSettings();
  const {alert, setAlert, setAlertDetails} = useAlert();
  const {addQuantity, orders, total} = useOrder();
  const [postcodeVerified, setPostcodeVerified] = useState(false)
  const [showDeliver, setShowDeliver] = useState();
  const [deliveryCost, setDeliveryCost] = useState(0);
  const postcodeRef = useRef(null);
  const [details, setDetails] = useState({
      address: {
          street: "",
          postcode: postcodeRef.current?.value,
          instructions: "",
        },
        name: "",
        number: null,
        email: "",
      
  })

  
useEffect(()=>{
  setShowDeliver(settings?.del)
},[])

const handleOrder = async ()=>{
  if(total < 10 && showDeliver){
    setAlertDetails({
      header: "Alert",
      message: "Order total must be over £10 for delivery.",
      type: "alert",
      onClose: setAlert,
      onConfirm: null,
    });
    setAlert(true)
    return;
  }else if(total < 6 && !showDeliver){
    setAlertDetails({
      header: "Alert",
      message: "Order total must be over £6 for collection.",
      type: "alert",
      onClose: setAlert,
      onConfirm: null,
    });
    setAlert(true)
    return;
  }
  let verify = false;
  let delCost = 0;
  if(router.query.location !== "Seaford"){
    setAlertDetails({
      header: "Alert",
      message: "Ordering from this branch is currently unavailable.",
      type: "alert",
      onClose: setAlert,
      onConfirm: null,
    });
    setAlert(true)
    return
  }
  if(showDeliver){
    try {
      const {success, outcode} = await verifySeafordPostcode(setAlert, setAlertDetails, postcodeRef);
      verify = success
      setPostcodeVerified(verify);
      if(verify){
        delCost = handleDeliveryCosts(outcode, router.query.location, total);
      }else{
        setAlertDetails({
          header: "Alert",
          message: "Failed to verify postcode.",
          type: "alert",
          onClose: setAlert,
          onConfirm: null,
        });
        setAlert(true)
        return
      }
    } catch (error) {
      console.error(error);
      setAlertDetails({
        header: "Alert",
        message: "Something went wrong. Please ensure all fields are completed correctly and total is over £10.",
        type: "alert",
        onClose: setAlert,
        onConfirm: null,
      });
      setAlert(true)
      return
    }
  }
  setDeliveryCost(delCost)
    createOrder({
       details: details,
       orders: orders,
       total: total,
       deliveryCost: delCost,
       delivery: showDeliver,
       time:0,
       note:"",
       status: 5,
       refunded: 0,
       location: router.query.location
       });
};

const createOrder = async (data) => {
  try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, data);
      if (res.status === 201) {
        addQuantity(0);
       await redirectWithQuery(`/order/${res.data._id}`, router);
      }
    } catch (err) {
      console.log(err);
      setAlertDetails({
        header: "Alert",
        message: "All fields must be completed correctly.",
        type: "alert",
        onClose: setAlert,
        onConfirm: null,
      });
      setAlert(true)
    }
  }; 

  useEffect(() => {
    if(!postcodeRef.current?.value){
      setPostcodeVerified(false)
    }
  }, [postcodeRef.current?.value])

return (
  <div className={styles.wrapper}>
    {alert ? <Alert/> : null}
  {router.query.location === "Seaford" ? 
  <>
    <h1 className={styles.title}>{settings?.del ? "Delivery options" : "collection details"}</h1>
    { 
      settings?.del ? 
        <>
          <h3 className={styles.time_hdr}>Delivery time approx {settings?.delTime}mins</h3>
          <h3 className={styles.time_hdr}>Collection time approx {settings?.colTime}mins</h3>
        </>
      : null
    } 

      <div className={styles.container}>
        <div className={styles.deliver_container}>
          {
          settings?.del ? 
          <>
            <button className={styles.btn_deliver}
            onClick={() => setShowDeliver(true)} 
            style={{ 
              background: showDeliver ? '#101010' : '#fff', 
              color: showDeliver ? '#fff' : '#101010' }}>
            Deliver
            </button>
            <p className={styles.or}>OR</p>            
            <button className={styles.btn_collection}
            style={{ 
              background: !showDeliver ? '#101010' : '#fff', 
              color: !showDeliver ? '#fff' : '#101010' }}
            onClick={() => setShowDeliver(false)}>
              Collect
            </button>
          </> 
          : 
          <p className={styles.del_unavialable}>Delivery unavailable!</p>
          }
        </div>
          
          <DeliveryCostsDetails location={router?.query?.location}/>
            
           <Details 
            postcodeRef={postcodeRef} 
            setDetails={setDetails} 
            showDeliver={showDeliver}
            />

          {
            !showDeliver | !postcodeVerified ? 
              null 
              : 
              <h2 className={styles.delivery_costs}>
                Delivery Fee:
                <strong 
                  style={{
                    color: "var(--text--light-green)"}}>
                  {deliveryCost ? 
                    deliveryCost.toLocaleString("en-US", {style: "currency", currency: "GBP"}) 
                    : 
                    "Free!"
                  }
                </strong>
              </h2>}

          <div className={styles.btn_container}>
          <button className={styles.checkoutBtn} onClick={()=>handleOrder()}>checkout</button>
          </div>
          </div>
      </>
        : <p className={styles.costs_hdr} style={{height: "40vh"}}>Please change location to Seaford!</p>
      }
          </div>
          )
        }
        
        export default Checkout