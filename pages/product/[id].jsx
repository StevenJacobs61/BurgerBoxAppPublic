import styles from '../../styles/product.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from "axios"
import redirectWithQuery from "../../functions/redirect"
import {useOrder} from "../../context/orderContext"
import {useSettings} from "../../context/settingsContext"
import {useMenu} from "../../context/menuContext"
import ProductInfo from '../../components/product/productInfo';
import Extras from '../../components/product/extras';
import Quantity from '../../components/product/quantity';
import Note from '../../components/product/note';

const Product = ({productsProp, product, settingsProp, sectionsProp}) => {

  const router = useRouter();
  const {addQuantity} = useOrder();
  const {width, settings, setSettings} = useSettings();
  const {products, setProducts, sections, setSections} = useMenu();
  const [available, setAvailable] = useState();
  const [extraToppings, setExtraToppings] = useState(()=>{
    const extras = productsProp.filter((prod) => prod.extraSection?.length);
    return extras.filter((extra) => extra.extraSection.some((es =[]) => es === product.section))
  })
  const [friesOption, setFriesOption] = useState(productsProp.find((product) => product.title === "Fries" && product.location === router.query.location))
  const [price, setPrice] = useState(product.price)
  const [fries, setFries] = useState(false)
  const [extraOptions, setExtraOptions] = useState([])
  const [extraUpgrades, setExtraUpgrades] =useState ([])
  const [productQuantity, setProductQuantity] = useState(1)
  const [note, setNote] = useState(null);
  
  useEffect(() => {
    setProducts(productsProp);
    setSections(sectionsProp);
    setSettings(settingsProp);
    setAvailable(sectionsProp.find((section) => section.title === product.section).available && product.available);
  }, [])

  useEffect(()=>{
    if(price < product.price){
      setPrice(product.price)
    }
  }, [price, product.price])
  
  const changePrice = (number) => {
    const priceSum = (price + number) * productQuantity;
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

  const handleOrder = async () => {

    const localOrders = JSON.parse(localStorage.getItem("Orders")) || [];
    localOrders.push({
      location: router.query.location, 
      product, 
      fries, 
      extraOptions, 
      extraUpgrades, 
      price, 
      quantity: productQuantity, 
      id: product._id, 
      note
    });

    localStorage.setItem('Orders', JSON.stringify(localOrders));  
    addQuantity(productQuantity);
    await redirectWithQuery("/home", router);
  }

return (
  <div className={styles.container}>

    <ProductInfo 
      product={product} 
      available={available} 
      productQuantity={productQuantity} 
      price={price}
    />

    <div className={styles.right}>

      {width >= 1024 ? 
      <h1 className={styles.hdr}>
        Sections options
      </h1> 
      : null}

      <div className={styles.options_wrapper}>

        {product.section.toLowerCase() === "burgers" ? 
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
            <Extras 
              extraOptions={extraOptions}
              extras={extraToppings.filter((extraTopping) => !extraTopping.veg)}
              setFunction={setExtraOptions}
              changePrice={changePrice}
              />

            <h4 className={styles.vegExtrasHeader}>Meatless Extras</h4>
            <Extras 
              extraOptions={extraOptions}
              extras={extraToppings.filter((extraTopping) => extraTopping.veg)} 
              setFunction={setExtraOptions}
              changePrice={changePrice}
              />

          </div> 
        : null}

        {products.some((product) => product.upgrade) ?
          <div className={styles.extraToppings}>
            <h3 className={styles.extraToppingsHeader}>Upgrades</h3>
            <Extras 
              extraOptions={extraUpgrades}
              extras={products.filter((product) => product.upgrade)}
              changePrice={changePrice} 
              setFunction={setExtraUpgrades}
            />
          </div>
        : null}

        <Quantity setProductQuantity={setProductQuantity}/>

        <Note setNote={setNote}/>

      </div>

      <div className={styles.containerOrder}>
        {settings.offline || !available ? 
          <p onClick={async ()=> await redirectWithQuery("/home", router)} className={styles.offline}>Unavailable</p> 
        : 
        <>
          <h3 className={styles.finalPrice}>
            Total: {(Math.round(price * productQuantity * 100) / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: 'GBP',
            })}
          </h3>
          <button className={styles.selectBtn} onClick={() => handleOrder()}>Add to basket</button>
        </>
        }
      </div>

    </div>
  </div>
  )
}

export const getServerSideProps = async (context) => {
  const { params, query, req } = context;
  const location = query.location;
  const myCookie = req?.cookies || "";

  let token = 
      location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
    : location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
    : null;

  if (myCookie.token === token){
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
 
  const productRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.id}`);
  const sectionsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sections`, locationFilter);
  const productsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, locationFilter);
  const settingsRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, locationFilter);
  

    return {
      props:{
        productsProp: productsRes.data,
        product: productRes.data,
        settingsProp: settingsRes.data,
        sectionsProp: sectionsRes.data
      }
    }
  }
export default Product




