import React from 'react'
import styles from '../../styles/admin-nav.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import  {MdOutlineNotificationsOff} from 'react-icons/md'
import  {MdOutlineNotificationsNone} from 'react-icons/md'
import  {MdOutlineNextPlan} from 'react-icons/md'
import  {HiOutlineLogout} from 'react-icons/hi'
import { useDispatch } from 'react-redux';
import { changeNotif } from '../../redux/cartSlice';
import { useSelector } from 'react-redux';
import { setAdmin } from '../../redux/userSlice'
import axios from 'axios'
import redirectWithQuery from '../../functions/redirect'


const AdminNav = ({setAlert, setAlertDetails}) => {

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart)
  const router =useRouter();
  const [notifications, setNotifications] = useState(cart.notifications);

  useEffect(() => {
    if (window.localStorage.getItem("Notifications") === null){
      window.localStorage.setItem("Notifications", "false");
    }
    const local = JSON.parse(localStorage.getItem("Notifications"));
    setNotifications(local)
    dispatch(changeNotif(local))
  }, [dispatch])

  const handleMute = () => {
    try{
      window.localStorage.setItem("Notifications", JSON.stringify(!notifications))
      dispatch(changeNotif(!notifications))
    setNotifications(!notifications)
    router.reload()
  } catch(err) {
    console.log(error);
  }
}

const handleLogout = async () => {
  setAlertDetails({
    header: "Are you sure?",
    message: "Please confirm you wish to log out.",
    type: "confirm",
    onClose: ()=>setAlert(false),
    onConfirm: ()=>logout(),
  });
  setAlert(true);
}
    
const logout = async () => {
  try {
    await axios.delete("/api/login/cookie", {
      params:{
        location: router.query.location
      }
    });
    redirectWithQuery("/home", router);
    setAlert(false)
    dispatch(setAdmin(false));
  } catch (error) {
    console.error(error);
    setAlertDetails({
      header: "Alert",
      message: "There was an error logging out, try deleting your BurgerBox browser cookie if the issue persists.",
      type: "alert",
      onClose: ()=>setAlert(false),
      onConfirm: null,
    });
    setAlert(true);
  }
}

  return (
    <div className={styles.container}>
          <MdOutlineNextPlan className={styles.icon}
          onClick={async () => {
            if (router.pathname === "/admin") await redirectWithQuery("/admin/orders", router);
            else await redirectWithQuery('/admin', router)
          }}/>
          <HiOutlineLogout className={styles.icon}
          onClick={()=> handleLogout()}/>
        {!notifications ?
        <div className={styles.icon_container}>
        <MdOutlineNotificationsOff 
        className={styles.icon} 
        onClick={() => handleMute()}/>
        </div> :
        <div className={styles.icon_container}>
          <MdOutlineNotificationsNone 
          onClick={() => handleMute()} 
          className={styles.icon}/>
          </div>
        }
    </div> 
  )
}

export default AdminNav