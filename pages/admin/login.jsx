import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styles from '../../styles/login.module.css'
import axios from 'axios'
import redirectWithQuery from '../../functions/redirect'
import Alert from '../../components/alert'


const Login = () => {

const[username, setUsername] = useState();
const[password, setPassword] = useState();
const router = useRouter();
const [alert, setAlert] = useState(false);
    const [alertDetails, setAlertDetails] = useState({
    header: null,
    message: null,
    type: null,
    onClose: ()=>setAlert(false),
    onConfirm: null,
  })


const handleUser = async () => {
  const location = router.query.location;
  try{
    if(username === "a" && password === "a"){
      const cookieRes = await axios.post(`/api/login/cookie`, {adminMatch:true, location})
    if(cookieRes.data){
      await redirectWithQuery("/admin/orders", router)
    }
    }
  } catch(err){
    console.log(err);
    setAlertDetails({
      header: "Alert",
      message: "There was an error whilst logging in. Please reload the page and try again.",
      type: "alert",
      onClose: ()=>setAlert(false),
      onConfirm: null,
    });
    setAlert(true);
    return;
  }
}

  return (
    <div className={styles.container}>
      {alert ? <Alert {...alertDetails}/> : null}
      <h1 className={styles.title}>You are logging into the {router.query.location} branch</h1>
        <span className={styles.login_container}>
            <h2 className={styles.hdr}>Admin Login</h2>
            <label htmlFor="username" className={styles.label}>username:</label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} className={styles.inputField}/>
            <label htmlFor="input" className={styles.label}>password:</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)}  className={styles.inputField}/>
              <button className={styles.button} onClick={()=>handleUser()}>login</button> 
        </span>

    </div>
  )
  }

export default Login

export const getServerSideProps = async (ctx) => {
  const { req, query } = ctx;
  const location = query.location;
    const myCookie = req?.cookies || "";
    let token = 
      location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
    : location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
    : null;
    if (myCookie.token === token) {
      const queryString = new URLSearchParams(query).toString();
      return {
        redirect: {
          destination: `/admin/orders?${queryString}`,
          permanent: false,
        },
      };
    }else {
      return {
        props:{}
      }
  } 
}