import Image from 'next/image'
import React, { useState, useEffect } from 'react';
import styles from '../../styles/navbar.module.css'
import {AiOutlineInstagram} from 'react-icons/ai';
import {FiFacebook} from 'react-icons/fi';
import {RiSnapchatLine} from 'react-icons/ri';
import {HiMenu, HiMenuAlt3} from 'react-icons/hi';
import {BsBasket} from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import logo from "../../public/img/logo-light.svg";
import redirectWithQuery from '../../functions/redirect';
import { addQuantity } from '../../redux/cartSlice';
import axios from 'axios';

const Navbar = ({setAlert, setAlertDetails}) => {
  const cart = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  
  const [click, setClick] = useState(true);
  const[mobileScreen, setMobileScreen] = useState(true);
  const router = useRouter();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [settings, setSettings] = useState(null);
  const [open, setOpen] = useState(true);

  const location = router.query.location;
  const loginPage = router.pathname === "/admin/login";
  const cartPage = router.pathname === "/cart";
  const orderPage = router.pathname === "/order/[id]";

  useEffect(() => {
    const getStoreData = async () => {
      const params = {
        location: location
      };
      try {
        const settingsRes = await axios.get(`/api/settings`, {params});
        const sectionsRes = await axios.get(`/api/sections`, {params});
        setOpen(sectionsRes?.data.some((section) => section.available));
        setSettings(settingsRes.data);
      } catch (error) {
        console.error(error);
        setAlertDetails({
          header: "Alert",
          message: "There was an error whilst retrieving store data. Please reload the page.",
          type: "alert",
          onClose: ()=>setAlert(false),
          onConfirm: null,
        });
        setAlert(true);
      }
    }
    // Update Quantity
    const localQuantity = parseInt(localStorage.getItem("Quantity"));
    const localOrders = JSON.parse(localStorage.getItem("Orders"));
    if(localQuantity && localOrders.length > 0){
      dispatch(addQuantity(localQuantity));
    }else{
      dispatch(addQuantity(0))
      localStorage.setItem("Quantity", "0")
      localStorage.setItem("Orders", "[]")
    }
    if(router.query?.success === "true"){
      dispatch(addQuantity(0))
      localStorage.setItem("Quantity", "0")
      localStorage.setItem("Orders", "[]")
    }
    // Get settings
    getStoreData()
  }, [router, dispatch, location, setAlert, setAlertDetails])

  const sizeDetector = () => {
  if(window.innerWidth > 768){
    setMobileScreen(false)
  } else {
    setMobileScreen(true)
  }
  }

  useEffect(() => {
    // Hide navbar on scroll down 
    sizeDetector()
    window.addEventListener('resize', sizeDetector)
    return () => {
      window.removeEventListener('resize', sizeDetector);
    };
  }, [])

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') { 
        if (window.scrollY > lastScrollY) { 
          setShowNav(false);
          setClick(true); 
        } else {
          setShowNav(true); 
        }
        setLastScrollY(window.scrollY); 
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const handleLocationChange = () => {
    setAlertDetails({
      header: "Confirm",
      message: "Changing location will reset your basket to empty. Please confirm you wish to do this.",
      type: "confirm",
      onClose: ()=>setAlert(false),
      onConfirm: ()=>changeLocation(),
    });
    setAlert(true);
  }
  const changeLocation = () => {
      localStorage.setItem("Orders", "[]");
      router.push("/")
  }
  return (
  <>
     <div className={styles.navbar} style={{top: showNav ? '0' : '-110%'}}>
        <div className={styles.container}>
            <div className={styles.chevron_container}>
            <div className={styles.socials}>
                  <div className={styles.social} onClick={() => {setClick(!click), router.push('https://www.facebook.com/BurgerBoxSeaford')}}> <FiFacebook className={styles.facebook}/> </div>
                  <div className={styles.social} onClick={() => {setClick(!click), router.push('https://www.instagram.com/burgerboxseaford/')}}> <AiOutlineInstagram className={styles.insta}/> </div>
                  <div className={styles.social} onClick={() => {setClick(!click), router.push('https://www.instagram.com/burgerboxseaford/')}}> <RiSnapchatLine className={styles.snap}/> </div>
            </div>
             {click ?  <HiMenu className={styles.chevron} onClick={() => setClick(!click)}/> :  <HiMenuAlt3 className={styles.chevron} onClick={() => setClick(!click)}/>}
            </div>
            <div className={styles.logo}
            style={{transform: !click ? "scale(1.2)" : '', left: !click ? "8%" : ''}}>
              <Image
              onClick={async ()=> await redirectWithQuery('/home', router)} 
              className={styles.img} 
              src={logo} 
              objectFit='fill'
              alt='logo'
              />
            </div>
            { click && mobileScreen ? null :<div className={styles.pagelinks} style={{display: click && mobileScreen ?"none":"flex"}}>
              <div className={styles.pagelink} onClick={async () => {return setClick(!click), await redirectWithQuery("/home", router)}}>Order</div>
              <div className={styles.pagelink} onClick={async () => {return setClick(!click), redirectWithQuery("/cart", router)}}>Checkout</div>
              <div className={styles.pagelink} onClick={async () => {return setClick(!click), redirectWithQuery("/admin", router)}}>Admin</div>
          </div>}
          { click && mobileScreen ? null :<div className={styles.contact}>
            <div className={styles.texts}>
              <div className={styles.text}>Contact Us</div>
              <div className={styles.text}>01323 899221</div>
            </div>
          </div>}
        </div>
        {!orderPage ? <div className={styles.locationsContainer}>
        <div className={styles.location}><p>Branch:</p><p>{location}</p></div>
        <div className={styles.changeLocation}><p className={styles.changeLocationText} onClick={()=>handleLocationChange()}>Wrong Store? (Change Location)</p></div>
        </div> :null}
        </div>
    {!loginPage && !cartPage && !settings?.offline && open ? <div className={styles.basket} style={{top: showNav && mobileScreen ? "8.5rem" : showNav && !mobileScreen ? "11rem" : !showNav ? "2rem" : ""}}>
          <p className={styles.quantity}>{cart.quantity}</p>
          <BsBasket className={styles.basket_icon} onClick={async () => await redirectWithQuery("/cart", router)}/>
              </div>:null}
     </>
  )
}

export default Navbar