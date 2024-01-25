import React, { useEffect, useState } from 'react'
import Footer from './footer'
import Navbar from './navbar'
import { useRouter } from 'next/router'
import AdminNav from '../admin/admin_nav'
import Alert from "../alert.jsx"
import { useSettings } from '../../context/settingsContext.js'

const Layout = ({ children }) => {
    const router =useRouter()
    const [admin, setAdmin] = useState()
    const {alert} = useSettings();

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
    <>{alert ? <Alert/> : null}
         {!admin ?  <Navbar/>  : <AdminNav/>}
          {children}
          {!admin ? <Footer/> : null}
      </>
    )
  }

export default Layout