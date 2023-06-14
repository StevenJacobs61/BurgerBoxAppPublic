import Head from 'next/head'
import Menu from '../components/menu'
import styles from '../styles/Home.module.css'
import { useDispatch } from 'react-redux'
import { setAdmin, setOffline} from '../redux/userSlice'
import { useEffect, useState } from 'react'
import LandingPage from '../components/landing_page/landing_page'
import axios from 'axios'
import { useRouter } from 'next/router'
import Alert from '../components/alert'
import settings from '../models/settings'
import dbConnect from '../utils/mongodb'
import products from '../models/products'
import sections from '../models/sections'

export default function Home({ productsString, sectionsString, settingsString, admin}) {

  const settings = JSON.parse(settingsString)
  const productsList = JSON.parse(productsString)
  const sections= JSON.parse(sectionsString)
  
  const sectionsList = sections.filter((section) => section.title !== "Extra Toppings" && section.title !== "Upgrades")
  const dispatch = useDispatch()
  const router = useRouter()
  const [alert, setAlert] = useState(false);
  const [alertDetails, setAlertDetails] = useState({
    header: null,
    message: null,
    type: null,
    onClose: ()=>setAlert(false),
    onConfirm: null,
  })
  
  useEffect(()=>{
    dispatch(setAdmin(admin))
    dispatch(setOffline(settings.offline))
  }, [dispatch, admin, settings])

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

  </div> 
  )
}
export const getServerSideProps = async (context) => {
  const { req, query } = context
  const location = query.location;

  const myCookie = req?.cookies || "";
  let admin = false;
  if (myCookie.token === process.env.TOKEN){
    admin = true
  }

  const locationFilter = {
    params: {
      location: location 
    }
  }

  // const sectionsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sections`, locationFilter)
  // const productsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, locationFilter)
  // const settingsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, locationFilter)

  dbConnect()
  const settingsList = await settings.findOne(query); 
  const settingsRes = JSON.stringify(settingsList);

  const itemsList = await products.find(query);
  const productsRes = JSON.stringify(itemsList);

  const sectionsList = await sections.find(query);
  const sectionsRes = JSON.stringify(sectionsList);
  return {
    props:{
          productsString: productsRes,
          sectionsString: sectionsRes, 
          settingsString: settingsRes,
          admin
          // productsList: productsRes.data,
          // sections: sectionsRes.data, 
          // settings: settingsRes.data,
          // admin
        }
    }
}