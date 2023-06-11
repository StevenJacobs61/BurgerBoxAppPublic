import styles from '../../styles/product.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { addQuantity } from '../../redux/cartSlice';
import { setOffline } from '../../redux/userSlice';
import {MdChildCare, MdOutlineFastfood, MdOutlineLocalDrink} from "react-icons/md"
import {GiHotMeal, GiCakeSlice, GiKetchup} from "react-icons/gi"
import axios from "axios"
import redirectWithQuery from "../../functions/redirect"

const Product = ({products, product, settings, sections}) => {

  const dispatch = useDispatch();
  const router = useRouter();
  
  const section = product.section.toLowerCase();
  const available = sections.find((section) => section.title === product.section).available && product.available;
  const friesOption = products.find((product) => product.title === "Fries" && product.location === router.query.location)

  // Find all items whihc are extras
  const extras = products.filter((product) => product.extraSection?.length)
  // filter to inlcude items that are extras to this products's section
  const extraToppings = extras.filter((extra) => extra.extraSection.some((es =[]) => es === product.section))
  const meatExtraToppings = extraToppings.filter((extraTopping) => extraTopping.veg === false)
  const vegExtraToppings = extraToppings.filter((extraTopping) => extraTopping.veg === true)
  const upgrades = products.filter((product) => product.upgrade)
  
  const [price, setPrice] = useState(product.price)
  const [fries, setFries] = useState(false)
  const [extraOptions, setExtraOptions] = useState([])
  const [extraUpgrades, setExtraUpgrades] =useState ([])
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState(null);

  // Resize detenction to show element on 1024px+ display
  const [width, setWidth] = useState();
  useEffect(() => {
    setWidth(window.innerWidth)
    dispatch(setOffline(settings.offline))
  }, [dispatch, settings.offline])

  useEffect(() => {
    window.addEventListener("resize", () =>setWidth(window.innerWidth));
  }, [])

  const changePrice = (number) => {
    const priceSum = (price + number) * quantity;
    const totalPrice = Math.round(priceSum * 100)/100;
    setPrice(totalPrice < 0 ? 0 : totalPrice);
  };

  const handleFries = () =>{
    if (!fries){
      changePrice(friesOption.price)
    } else {
      changePrice(-friesOption.price)
    }
    setFries(!fries);
  }

  const handleUpgrades = (upgrade) => {
  const incl = extraUpgrades.some((up)=> up._id === upgrade._id)
    if(!incl){
      changePrice(upgrade.price),
      setExtraUpgrades((prev) => [...prev, upgrade])
    } else{
      changePrice(-upgrade.price)
      setExtraUpgrades(extraUpgrades.filter((up) => up._id !== upgrade._id));
    }
  }

  const handleToppings = (extra) => {
    const incl = extraOptions.some((ex)=> ex._id === extra._id)
    if(!incl){
      changePrice(extra.price)
      setExtraOptions((prev) => [...prev, extra])
    } else{
      changePrice(-extra.price),
      setExtraOptions(extraOptions.filter((ex) => ex._id !== extra._id));
    }
  }

  const handleOrder = async () => {
    // Add order to local storage
    const id = product._id;
    const location = router.query.location;
    if(!localStorage.getItem("Orders")){
      localStorage.setItem("Orders", "[]");
    }
    const localOrders = JSON.parse(localStorage.getItem("Orders"));
    localOrders.push({location, product, fries, extraOptions, extraUpgrades, price, quantity, id, note});
    localStorage.setItem('Orders', JSON.stringify(localOrders));  
    updateQuantity();  
    await redirectWithQuery("/home", router);
  }
  // Update quantity in local storage and redux state
  const updateQuantity = () => {
    const localQuantity = localStorage.getItem("Quantity");
    if(localQuantity){
      const updatedQuantity = parseInt(localQuantity) + parseInt(quantity)
      localStorage.setItem("Quantity", JSON.stringify(updatedQuantity));
      dispatch(addQuantity(updatedQuantity));
    }else{
      localStorage.setItem("Quantity", JSON.stringify(quantity));
      dispatch(addQuantity(parseInt(quantity)));
    }
  }
  useEffect(()=>{
    if(price < product.price){
      setPrice(product.price)
    }
  }, [price])
  

return (
  <div className={styles.container}>
    <div className={styles.left}>
      <div className={styles.img_container}>
        {section === "burgers" ?
          <MdOutlineFastfood className={styles.icon}/>
          : section === "kids box meals" ?
          <MdChildCare className={styles.icon}/>
          : section === "dips" ?
          <GiKetchup className={styles.icon}/>
          : section === "dessert" ?
          <GiCakeSlice className={styles.icon}/>
          : section === "drinks" ?
          <MdOutlineLocalDrink className={styles.icon}/>
          : <GiHotMeal className={styles.icon}/>}
      </div>
       <h1 className={styles.title}>{product.title}</h1>
       {settings.offline || !available ? <h2 className={styles.offline}>Unavailable</h2> : <h2 className={styles.price}>Total: {(Math.round(price * quantity * 100) / 100).toLocaleString('en-US', {
          style: 'currency',
          currency: 'GBP',
        })}</h2>}
       <p className={styles.desc}>&quot;{product.desc}&quot;</p>
    </div>

    <div className={styles.right}>
      {width >= 1024 ? <h1 className={styles.hdr}>Sections options</h1> : null}
      <div className={styles.options_wrapper}>
        {section === "burgers" ? 
          <div className={styles.topping_container}>
            <h3 className={styles.topping}>Add Fries</h3>
            <div className={styles.price_wrapper}>
              <input className={styles.toppingCheckbox} type="checkbox" onClick={() => handleFries()}/>
              <p key={friesOption._id}className={styles.toppingPrice}>{friesOption.price.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</p>
            </div>
          </div> 
        : null}
            
        {extraToppings.length >= 1 ?
          <div className={styles.extraToppings}>
            <h3 className={styles.extraToppingsHeader}>Extra Toppings</h3>
            <h4 className={styles.meatExtrasHeader}>Meaty Extras</h4>
            {meatExtraToppings.map((extra) => extra.available === true ?
              <div key={extra._id}className={styles.topping_container}>
                <h3 className={styles.topping}>{extra.title}</h3>
                <div className={styles.price_wrapper}> 
                  <input className={styles.toppingCheckbox} type="checkbox" onClick={()=>handleToppings(extra)}/>
                  {extra.price > 0 ? <p className={styles.toppingPrice}>{extra.price.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</p> 
                  : <p className={styles.toppingPrice}>Free!</p> }
                </div>
              </div>
            : null)}
            <h4 className={styles.vegExtrasHeader}>Meatless Extras</h4>
            {vegExtraToppings.map((extra) => extra.available === true ?
              <div key={extra._id}className={styles.topping_container}>
                <h3 className={styles.topping}>{extra.title}</h3>
                <div className={styles.price_wrapper}> 
                  <input className={styles.toppingCheckbox} type="checkbox" onClick={()=>handleToppings(extra)}/>
                  {extra.price > 0 ? <p className={styles.toppingPrice}>{extra.price.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</p> 
                  : <p className={styles.toppingPrice}>Free!</p> }
                </div>
              </div>
            : null)}
          </div> 
        : null}

        {upgrades.length >= 1 ?
          <div className={styles.extraToppings}>
            <h3 className={styles.extraToppingsHeader}>Upgrades</h3>
            {upgrades.map((upgrade) => upgrade.available ? 
              <div key={upgrade._id}className={styles.topping_container}>
                <h3 className={styles.topping}>{upgrade.title}</h3>
                <div className={styles.price_wrapper}> 
                  <input className={styles.toppingCheckbox} type="checkbox" onClick={()=> handleUpgrades(upgrade)}/>
                  {product.price > 0 ? 
                    <p className={styles.toppingPrice}>{upgrade.price.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</p> 
                  : <p className={styles.toppingPrice}>Free!</p>}
                </div>
              </div>
            : null)}
          </div>
        : null}

        <div className={styles.quantity_container}>
          <h3 className={styles.extraToppingsHeader}>Quantity</h3>
          <input
            className={styles.quantity}
            type="number"
            placeholder="1"
            id="amount"
            name="amount"
            onChange={(e) => {
              const value = e.target.value;
              const parsedValue = parseInt(value);
              if (!isNaN(parsedValue) && parsedValue >= 1) {
                setQuantity(parsedValue);
              } else {
                setQuantity(1);
              }
            }}
            defaultValue="1"
            min="1"
          />
        </div>
        <div className={styles.note_container}>
          <h3 className={styles.info_hdr} >Allergy Advice:</h3>
          <p className={styles.info_text}>Please call to inform our staff on 01323 899221 if you have any allergies or dietry requirments so that we can advise you and avoid any unwanted reactions and accomodate your needs accordingly.</p>
          <p className={styles.info_text}>Our dishes may contain: molluscs, lupin, sulphates, sesame, mustard, nuts, milk, fish, eggs, crustaceans and cereals containing gluton.</p>
        </div>
        <div className={styles.note_container}>
          <h3 className={styles.info_hdr} >Special Instructions:</h3>
          <p className={styles.info_text}>Please detail any special instructions or requirements here. For allegy information, call in store at.</p>
          <p className={styles.info_text}>Max 75 characters</p>
          <textarea className={styles.info_input} placeholder="Write information here..." maxLength="75" 
            onChange={(e) => setNote(e.target.value)}/>
        </div>
      </div>
      <div className={styles.containerOrder}>
        {settings.offline || !available ? 
          <p onClick={async ()=> await redirectWithQuery("/home", router)} className={styles.offline}>Unavailable</p> 
        : <>
        <h3 className={styles.finalPrice}>Total: {(Math.round(price * quantity * 100) / 100).toLocaleString('en-US', {
          style: 'currency',
          currency: 'GBP',
        })}</h3>
        <button className={styles.selectBtn} onClick={() => handleOrder()}>Add to basket</button>
          </>}
      </div>
    </div>
  </div>
  )
}

export const getServerSideProps = async (context) => {
  const { params, query } = context;
  const location = query.location;

  const locationFilter = {
    params: {
      location: location 
    }
  }
 
  const productRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.id}`);
  const sectionsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sections`, locationFilter);
  const productsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, locationFilter);
  const settingsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, locationFilter);
  

    return {
      props:{
        products: productsRes.data,
        product: productRes.data,
        settings: settingsRes.data,
        sections: sectionsRes.data
      }
    }
  }
export default Product




