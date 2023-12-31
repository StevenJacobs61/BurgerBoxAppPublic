import React, {useState} from 'react'
import styles from '../../styles/admin/orders.module.css'
import axios from 'axios'
import CurrentOrders from '../../components/admin/orders/current-orders'
import { useRouter } from 'next/router'
import Alert from '../../components/alert'
import dbconnect from '../../utils/mongodb'

const Orders = ({ordersList, settings}) => {
  const router = useRouter();
  const [alert, setAlert] = useState(false);
  const [alertDetails, setAlertDetails] = useState({
    header: null,
    message: null,
    type: null,
    onClose: ()=>setAlert(false),
    onConfirm: null,
  });
  return (
    <div className={styles.container}>
      {alert ? <Alert {...alertDetails}/> : null}
        <CurrentOrders 
        orders={ordersList} 
        sets={settings} 
        {...{setAlert, setAlertDetails}}/>
    </div>
  )
}

export default Orders

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
    
    await dbconnect();
 
    const settingsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, locationFilter)
    const ordersRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, requestConfig)
    
    return {
      props:{
            ordersList: ordersRes.data,
            settings: settingsRes.data,
          }
      }
  }