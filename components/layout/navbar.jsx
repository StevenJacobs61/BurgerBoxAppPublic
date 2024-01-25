import Image from 'next/image'
import React, { useState, useEffect } from 'react';
import styles from '../../styles/navbar.module.css'
import {AiOutlineInstagram} from 'react-icons/ai';
import {FiFacebook} from 'react-icons/fi';
import {RiSnapchatLine} from 'react-icons/ri';
import {HiMenu, HiMenuAlt3} from 'react-icons/hi';
import {BsBasket} from 'react-icons/bs';
import { useRouter } from 'next/router';
import logo from "../../public/img/logo-light.svg";
import redirectWithQuery from '../../functions/redirect';
import {useSettings} from "../../context/settingsContext"
import { links } from '../../data/links';
import LocationComp from './locationComp';
import { useOrder } from '../../context/orderContext';
import { handlePhoneNumberAction } from '../../functions/phoneNumber';

const Navbar = () => {
  const {settings} = useSettings();
  const {addQuantity, quantity, setQuantity} = useOrder();
  
  const [click, setClick] = useState(true);
  const[mobileScreen, setMobileScreen] = useState(true);
  const router = useRouter();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const showBasket = 
    router.pathname !== "/admin/login" && 
    router.pathname !== "/cart" && 
    !settings?.offline && 
    router.pathname !== "/franchise";

  const showLocations = 
    router.pathname !== "/order/[id]" && 
    router.pathname !== "/franchise";

  useEffect(() => {
    const localQuantity = parseInt(localStorage.getItem("quantity"));
    if(localQuantity){
      setQuantity(localQuantity)
    }
  }, [router, location, setQuantity])

  const sizeDetector = () => {
    if(window.innerWidth > 768){
      setMobileScreen(false)
    } else {
      setMobileScreen(true)
    }
  }

  useEffect(() => {
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
            style={{transform: !click ? "scale(1.05)" : '', left: !click ? "2%" : ''}}>
              <Image
              onClick={async ()=> await redirectWithQuery('/home', router)} 
              className={styles.img} 
              src={logo} 
              objectFit='fill'
              alt='logo'
              />
            </div>

            {click && mobileScreen ? null :<div className={styles.pagelinks} style={{display: click && mobileScreen ?"none":"flex"}}>
              {links.map((link, i) => 
              <div className={styles.pagelink} key={i} onClick={async () => {return setClick(!click), await redirectWithQuery(link.route, router)}}>{link.text}</div>
              )}
          </div>}

          {click && mobileScreen ? null :<div className={styles.contact}>
            <div className={styles.texts}>
              <div className={styles.text}
              onClick={()=> handlePhoneNumberAction("+441323899221")}
              >+441323 899221</div>
            </div>
          </div>}
        </div>
        {showLocations ?  
          <LocationComp/>
        :null}
        </div>
        
    {showBasket && click ? <div className={styles.basket} style={{top: showNav && mobileScreen ? "7rem" : showNav && !mobileScreen ? "11rem" : !showNav ? "2rem" : ""}}>
          <p className={styles.quantity}>{quantity}</p>
          <BsBasket className={styles.basket_icon} onClick={async () => await redirectWithQuery("/cart", router)}/>
              </div>:null}
     </>
  )
}

export default Navbar