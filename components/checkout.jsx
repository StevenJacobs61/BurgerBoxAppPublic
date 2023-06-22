import React, { useState, useEffect, useRef } from 'react'
import styles from '../styles/checkout.module.css'
import { addQuantity} from "../redux/cartSlice";
import { useRouter } from 'next/router';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import redirectWithQuery from "../functions/redirect"
import Alert from './alert';


const Checkout = ({settings, total, orders}) => {

  const router = useRouter();
  const dispatch = useDispatch()

// ** Delivery details set by useEffect on input change

const pco = useRef(null)
const [name,setName] = useState();  
const [street,setStreet] = useState();
const [postcode, setPostcode] = useState(null);
const [number,setNumber] = useState();
const [email, setEmail] = useState();
const [instructions, setInstructions] = useState();
const [postcodeVerified, setPostcodeVerified] = useState(false)
const [alert, setAlert] = useState(false);
const [alertDetails, setAlertDetails] = useState({
  header: null,
  message: null,
  type: null,
  onClose: ()=>setAlert(false),
  onConfirm: null,
})


// ** Track delivery or Collection Option
const [showDeliver, setShowDeliver] = useState(()=> {
  if(settings.del) return true;
  else return false;
});

const [deliveryCost, setDeliveryCost] = useState();

const handleSeafordDeliveryCosts = (outcode) =>{
  if(!showDeliver){
    setDeliveryCost(0)
  }else{
    if(outcode === "bn25"){
      if(total >= 13){
        setDeliveryCost(0)
      } else if (total < 13){
        setDeliveryCost(3)
      }
    }
    if(outcode === "bn9"){
      if(total >= 18){
        setDeliveryCost(0)
      } else if (total < 18){
        setDeliveryCost(5)
      }
    }
    if(outcode === "bn26" || outcode == "bn10"){
      if(total >= 26){
        setDeliveryCost(0)
      } else if (total < 26){
        setDeliveryCost(6)
      }
    }
  }
}
// ** Prepare data for order submission
const handleOrder = async ()=>{
  let verify = false;
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

  else if(showDeliver){
    try {
      verify = await verifySeafordPostcode();
    } catch (error) {
      console.error(error);
    }
  }
  if(verify | !showDeliver){
    createOrder({details:{
       address: {
           street:street,
           postcode:postcode,
           instructions:instructions
         },
         name:name,
         number:number,
         email:email,
       },
       orders: orders,
       total: total,
       deliveryCost: deliveryCost,
       delivery: showDeliver,
       time:0,
       status: 5,
       refunded: 0,
       location: router.query.location
       });
  }
};
    
    const verifySeafordPostcode = async () => {
      let showAlert = false;
      if(!postcode){
        setAlertDetails({
          header: "Alert",
          message: "Please complete all fields correctly.",
          type: "alert",
          onClose: setAlert,
          onConfirm: null,
        });
        setAlert(true)
        return;
      }
      const cleanedPostcode = postcode.replace(/\s/g, '').toLowerCase();
      try {
        const postcodeRes = await axios.get(`https://api.postcodes.io/postcodes/${cleanedPostcode}`);
        console.log(postcode.data);
        const outcode = postcodeRes.data.result.outcode.toLowerCase();
        if (outcode !== 'bn9' && outcode !== 'bn10' && outcode !== 'bn25' && outcode !== 'bn26') {
          setAlertDetails({
            header: "Alert",
            message: "We do not deliver to this postcode.",
            type: "alert",
            onClose: setAlert,
            onConfirm: null,
          });
          setAlert(true)
          showAlert = true;
          return;
        }
        handleSeafordDeliveryCosts(outcode);
        setPostcodeVerified(true);
      } catch (error) {
        console.error(error);
        setAlertDetails({
          header: "Alert",
          message: "Please enter a valid postcode.",
          type: "alert",
          onClose: setAlert,
          onConfirm: null,
        });
        setAlert(true)
        showAlert = true;
      }
      return !showAlert;
    };
    
useEffect(() => {
  if(!postcode){
    setPostcodeVerified(false)
  }
}, [postcode])

const createOrder = async (data) => {
  if(data.total < 10){
    setAlertDetails({
      header: "Alert",
      message: "Order total must be over £10.",
      type: "alert",
      onClose: setAlert,
      onConfirm: null,
    });
    setAlert(true)
    return;
  }
  try {
      const res = await axios.post("/api/orders", data);
      if (res.status === 201) {
        // Change quantity for redux state (basket icon)
        dispatch(addQuantity(0));
        // redirect to order page
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
    }}; 

const pcPlaceholder = router.query.location === "Seaford" ? "BN9, BN10, BN25 or BN26" : "BN20, BN21 or BN22";

return (
  <div className={styles.wrapper}>
    {alert ? <Alert {...alertDetails}/> : null}
  {router.query.location === "Seaford" ? 
  <>
    <h1 className={styles.title}>{settings.del ? "Delivery options" : "collection details"}</h1>
    { settings.del ? <>
      <h3 className={styles.time_hdr}>Delivery time approx {settings.delTime}mins</h3>
      <h3 className={styles.time_hdr}>Collection time approx {settings.colTime}mins</h3>
    </>
    : null} 
    <div className={styles.container}>
        <div className={styles.deliver_container}>
          {settings.del ? <><button className={styles.btn_deliver}
          onClick={() => setShowDeliver(true)} style={{ background: showDeliver ? '#101010' : '#fff', color: showDeliver ? '#fff' : '#101010' }}>
          Deliver
          </button>
          <p className={styles.or}>OR</p>            
          <button className={styles.btn_collection}
          style={{ background: !showDeliver ? '#101010' : '#fff', color: !showDeliver ? '#fff' : '#101010' }}
          onClick={() => setShowDeliver(false)}>Collect</button>
          </> 
          : <p className={styles.del_unavialable}>Delivery unavailable!</p>}
        </div>
            <p className={styles.costs_hdr}>Free Home Delivery:</p>
            <p className={styles.costs}><strong>Seaford + Bishopstone(BN25)</strong><br/>Orders over £13, else £3 charge</p>
            <p className={styles.costs}><strong>Denton + Newhaven(BN9)</strong><br/>Orders over £18, else £5 charge</p>
            <p className={styles.costs}><strong>Peacehaven(BN10) + Alfriston(BN26)</strong><br/>Orders over £26, else £6 charge</p>
            <p className={styles.text}>*All fields except &apos;Delivery Instructions&apos; are required.</p>
            <div className={styles.details_container}>
            <label htmlFor="" className={styles.details_label}>Full Name</label>
            <input type="text" id='name' name='name' placeholder='' className={styles.details_input}
            onChange={(e) => setName(e.target.value)}/>
            {showDeliver && <><label htmlFor="" className={styles.details_label}>Street Address</label>
            <input type="text" placeholder='' id='street' name='street' className={styles.details_input}
            onChange={(e) => setStreet(e.target.value)}/>
            <label htmlFor="" className={styles.details_label}>Postcode</label>
          <input type="text" placeholder={pcPlaceholder} id='postcode' name='postcode' className={styles.details_input_postcode}
          onChange={(e) => setPostcode(e.target.value)} onBlur={()=> verifySeafordPostcode()}/>
          {/* </div> */}
          <label htmlFor="" className={styles.details_label}>Delivery Instrutions</label>
          <textarea type="text" placeholder=''
          className={styles.instructions} onChange={(e)=>setInstructions(e.target.value)}/>
          </>}
          <label htmlFor="" className={styles.details_label}>Phone Number</label>
          <input type="text" placeholder='' id='number' name='number' className={styles.details_input}
          onChange={(e) => setNumber(e.target.value)}/>
          <label htmlFor="" className={styles.details_label}>Email</label>
          <input type="email" placeholder='' id='email' name='email' className={styles.details_input}
          onChange={(e) => setEmail(e.target.value)}/>
          </div>
          {!showDeliver | !postcodeVerified ? null : <h2 className={styles.delivery_costs}>Delivery Fee: <strong style={{color: "var(--text--light-green)"}}>{deliveryCost ? deliveryCost.toLocaleString("en-US", {style: "currency", currency: "GBP"}) : "Free!"}</strong></h2>}
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