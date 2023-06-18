import React from 'react'
import styles from '../../../styles/manage-product.module.css'
import Image from 'next/image'
import axios from 'axios'
import { useState } from 'react'
import MakeExtra from './make-extra'
import ViewProduct from './view-product'
import Show from '../../show'
import { useRouter } from 'next/router'

const ManageProduct = ({product, setProducts, products, sections, setAlert, setAlertDetails, upgrade}) => {

    const [showMakeExtra, setShowMakeExtra] = useState(false);
    const [isExtra, setIsExtra] = useState(product?.extraSections && product?.extraSections.length > 0)
    const [showButtons, setShowButtons] = useState(false);
    const [showProduct, setShowProduct] = useState(false);
    const router = useRouter();
    const id = product._id;

    
// Delete a product
  const handleDelete = async () => {
    if(product.title === "Fries" &&
    products.filter(
      (p) => p.title === "Fries" && p.location === router.query.location
    ).length === 1){
      setAlertDetails({
        header: "Alert",
        message: "There must be at least one menu item named 'Fries'.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
      return;
    }else{
      setAlertDetails({
        header: "Are you sure?",
        message: "Please confirm you wish to delete this product.",
        type: "delete",
        onClose: ()=>setAlert(false),
        onConfirm: ()=>deleteProduct(),
      });
      setAlert(true);
    }
  }
  const deleteProduct = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/` + id, {
          params:{
            location:router.query.location
          }
        }
      );
      setProducts(products.filter((item) => item._id !== id));
      setShowProduct(false)
    } catch (err) {
      console.log(err);
      setAlertDetails({
        header: "Alert",
        message: "There was an error whilst deleting this product. Please reload the page and try again.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
    }
  };

// Manage products availability settings
  const handleAvailable = async () => {
   const newData = {
    available: !product.available
   }
  try{
     const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/` + id, newData, {
      params:{
        location:router.query.location
      }
    })
     setProducts(products.map((prod) => {
      if (prod._id === id) {
        prod.available = newData.available;
      } return prod;
     }))
  }catch(err){
      console.log(err);
      setAlertDetails({
        header: "Alert",
        message: "There was an error whilst updating this product. Please reload the page and try again.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
  }};
  // Make product an upgrade option
  const handleUpgrade = async () => {
   const newData = {
    upgrade: !product.upgrade
   }
   try{
     const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/` + id, newData, {
      params:{
        location:router.query.location
      }
    })
     setProducts(products.map((prod) => {
      if (prod._id === id) {
        prod.upgrade = newData.upgrade;
      } return prod;
     }))
  }catch(err){
      console.log(err);
      setAlertDetails({
        header: "Alert",
        message: "There was an error whilst upgrading this product. Please reload the page and try again.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
  }};
  return(
  <>
    <tr className={styles.tr}>
      <td onClick={() => setShowButtons(!showButtons)}>{product.available ?
        <Image style={{transform: product.available ? 'scale(1)' : 'scale(0.2)', cursor: "pointer"}}
        className={styles.img}
        src={'/img/burger.webp'}
        width={40} height={40} objectFit='cover' alt='photo'
        />
     : <p className={styles.unavailable}>x</p> }
      </td>
      <td className={styles.text} 
        onClick={() => setShowButtons(!showButtons)}
      >..{product._id.slice(-3)}</td>
      <td className={styles.text} 
        onClick={() => setShowButtons(!showButtons)}
      >{product.title}</td>
      <td className={styles.text} 
        onClick={() => setShowButtons(!showButtons)}
      >{product.price === 0 ? "Free" : product.price.toLocaleString("en-US", {style: "currency", currency: "GBP"})}
      </td>
      <td> 
      {upgrade ? 
      <button className={styles.btnUpgradeSection} 
        style={{
          color: product.upgrade ? 'rgb(210, 164, 16)' : '#7a7a7a', 
          opacity: product.upgrade ? "1" : "0.5"}} 
          onClick={() => handleUpgrade()}
      >Upgrade</button>
      : showButtons ?
        <div className={styles.btn_container}>
          <button className={styles.btn_available} 
            style={{
              color: product.available ? 'var(--text--light-green)' : '#7a7a7a', 
              opacity: product.available ? "1" : "0.5"}} 
              onClick={() => handleAvailable()}
          >available</button>
          <button className={styles.btn_upgrade} 
            style={{
              color: product.upgrade ? 'rgb(210, 164, 16)' : '#7a7a7a', 
              opacity: product.upgrade ? "1" : "0.5"}} 
              onClick={() => handleUpgrade()}
          >Upgrade</button>
          <button className={styles.btn_extra} 
            style={{
              color: isExtra ? '#3e80d5' : '#7a7a7a', 
              opacity: isExtra ? "1" : "0.5"}} 
              onClick={() => setShowMakeExtra(true)}
          >Extra</button>
          <button className={styles.btn_edit} 
            onClick={()=> setShowProduct(true)}
          >Edit</button>
          <button className={styles.btn_delete} 
            onClick={() => handleDelete()}
          >Delete</button>
        </div>
          : <button className={styles.btn_show} 
              onClick={()=>setShowButtons(true)}
            >Options</button>}
      </td>
    </tr>
  <tr>
    <td>
      {showMakeExtra ?
      <Show setShow={setShowMakeExtra}>
        <MakeExtra 
        showMakeExtra={showMakeExtra}
        setShow={setShowMakeExtra}
        product={product} 
        sections={sections} 
        setIsExtra={setIsExtra}
        products={products}
        setProducts={setProducts}
        {...{setAlert, setAlertDetails}}
        />
      </Show>
       : null}
      {showProduct ? 
      <Show setShow={setShowProduct}>
        <ViewProduct product={product} 
        products={products}
        setProducts={setProducts}
        setShow={setShowProduct}
        {...{setAlert, setAlertDetails}}
      />
      </Show>
    : null}
    </td>
  </tr>
  </>
      )
}

export default ManageProduct