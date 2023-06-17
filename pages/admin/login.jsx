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
    const res = await axios.post(`/api/login`, {username, password, location, isApp:true})
    if(res.data){
      const cookieRes = await axios.post(`/api/login/cookie`, {adminMatch:true})
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
            <input type="text" onChange={(e) => setUsername(e.target.value)} className={styles.input}/>
            <label htmlFor="input" className={styles.label}>password:</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)}  className={styles.input}/>
              <button className={styles.button} onClick={()=>handleUser()}>login</button> 
        </span>

    </div>
  )
  }

export default Login

