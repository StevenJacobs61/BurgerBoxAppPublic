import React, { useEffect, useState } from 'react'
import Footer from './footer'
import Navbar from './navbar'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { changeLocation } from '../../redux/locationSlice'
import AdminNav from '../admin/admin_nav'
import Alert from "../alert.jsx"

const Layout = ({ children }) => {
    const router =useRouter()
    const dispatch = useDispatch()
    const [admin, setAdmin] = useState()
    const [alert, setAlert] = useState(false);
    const [alertDetails, setAlertDetails] = useState({
    header: null,
    message: null,
    type: null,
    onClose: ()=>setAlert(false),
    onConfirm: null,
  })
    useEffect(() => { 
      if(!router.query.location){
        router.push("/")
      }else{
          dispatch(changeLocation(router.query.location))
      }
      if(router.pathname === "/admin/orders" || router.pathname === "/admin"){
        setAdmin(true)
      } else{
        setAdmin(false)
      }
    }, [router, dispatch])

  return (
    <>{alert ? <Alert {...alertDetails}/> : null}
         {admin ? <AdminNav {...{setAlert, setAlertDetails}}/> : <Navbar {...{setAlert, setAlertDetails}}/>}
          {children}
          {!admin ? <Footer/> : null}
      </>
    )
  }

export default Layout