import React, { useEffect, useState } from 'react'
import Footer from './footer'
import Navbar from './navbar'
import { useRouter } from 'next/router'
import AdminNav from '../admin/admin_nav'
import Alert from "../alert.jsx"

const Layout = ({ children }) => {
    const router =useRouter()
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
      }
      if(router.pathname === "/admin/orders" || router.pathname === "/admin"){
        setAdmin(true)
      } else{
        setAdmin(false)
      }
    }, [router])
    
  return (
    <>{alert ? <Alert {...alertDetails}/> : null}
         {!admin ?  <Navbar {...{setAlert, setAlertDetails}}/>  : <AdminNav {...{setAlert, setAlertDetails}}/>}
          {children}
          {!admin ? <Footer/> : null}
      </>
    )
  }

export default Layout