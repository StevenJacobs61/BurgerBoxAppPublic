import React, { useState } from 'react'
import Checkout from '../components/checkout'
import Orders from '../components/orders'
import styles from '../styles/cart.module.css'
import axios from 'axios'
import {getOrders, getTotal} from '../functions/local'


const Cart = ({settings}) => {
  const [total, setTotal] = useState(()=>getTotal());
  const [orders, setOrders] = useState(()=>getOrders());

  return (
    <div className={styles.container}>

      <div className={styles.wrapper}>
        <div className={styles.products}>
            <Orders 
            {...{setTotal, total, orders, setOrders }}/>
        </div>
        <div className={styles.checkout}>
          <Checkout 
            {...{ settings, total, orders}}/>
        </div>
      </div>

    </div>
  )
}

export default Cart

export const getServerSideProps = async (context) => {
  const { query, req } = context;
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
 
  const settingsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, locationFilter);

  return {
    props:{
          settings: settingsRes.data
        }
    }
} 