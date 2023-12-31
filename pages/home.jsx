import Head from 'next/head'
import Menu from '../components/menu'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import LandingPage from '../components/landing_page/landing_page'
import axios from 'axios'
import { useRouter } from 'next/router'
import Alert from '../components/alert'
import dbConnect from '../utils/mongodb'
import About from '../components/about'

export default function Home({ productsList, sections, settings, admin}) {
  
  const sectionsList = sections.filter((section) => section.title !== "Extra Toppings" && section.title !== "Upgrades")
  const router = useRouter()
  const [alert, setAlert] = useState(false);
  const [alertDetails, setAlertDetails] = useState({
    header: null,
    message: null,
    type: null,
    onClose: ()=>setAlert(false),
    onConfirm: null,
  })
  

  return (
    <div className={styles.container}>
      <Head>        
        <title>Burger Box Seaford</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/img/order-box.webp" />
      </Head>
      {alert ? <Alert {...alertDetails}/> : null}
      <LandingPage settings={settings} sections={sectionsList}/>
      <Menu 
      sectionsList={sectionsList} 
      settings={settings} 
      productsList={productsList} 
      admin={admin}
      setAlert={setAlert}
      setAlertDetails={setAlertDetails}/>
      <About/>
  </div> 
  )
}
export const getServerSideProps = async (context) => {
  const { req, query } = context
  const location = query.location;

  const myCookie = req?.cookies || "";
  let admin = false;

  let token = 
      location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
    : location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
    : null;

  if (myCookie.token === token){
    admin = true
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
  
  await dbConnect();

  const sectionsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sections`, locationFilter)
  const productsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, locationFilter)
  const settingsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, locationFilter)
  
  
  return {
    props:{
          productsList: productsRes.data,
          sections: sectionsRes.data, 
          settings: settingsRes.data,
          admin
        }
    }
}