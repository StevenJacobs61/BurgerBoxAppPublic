import React from 'react'
import styles from '../../../styles/manage-extras.module.css'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const ManageExtra = ({product, products, setProducts, section, setAlert, setAlertDetails}) => {
  
  const [index, setIndex] = useState(products.indexOf(product)) 
  const [showButtons, setShowButtons] = useState(false);
  const router = useRouter();
  

    const handleAvailable = async (id) => {
      const newData = {
       available: !products[index].available
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
          message: "There was an issue updating this product.",
          type: "alert",
          onClose: ()=>setAlert(false),
          onConfirm: null,
        });
        setAlert(true);
      }
    }
    const handleDel = () => {
      if(product.title === "Fries" &&
      products.filter(
        (p) => p.title === "Fries" && p.location === router.query.location
      ).length === 1
    ){
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
        type: "confirm",
        onClose: ()=>setAlert(false),
        onConfirm: ()=>delProduct(),
      });
      setAlert(true);
    }}
    const delProduct = async () => {
        const id = product._id;
        try {
          const res = await axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/` + id, {
              params:{
                location:router.query.location
              }
            }
          );
            setProducts(products.filter((prod) =>  prod._id !== id))
        } catch (err) {
          console.log(err);
          etAlertDetails({
            header: "Alert",
            message: "There was an error whilst deleting this product. Please reload and try again.",
            type: "alert",
            onClose: ()=>setAlert(false),
            onConfirm: null,
          });
          setAlert(true);
        }
      };

    const handleDelExtra = async (id) => {
      const extraSections = product.extraSection.filter((es)=> es !== section.title)
      const newData = {
        extraSection:extraSections
      }
        try {
          const res = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/` + id, newData, {
              params:{
                location:router.query.location
              }
            });
            setProducts(products.map((prod) => {
              if (prod._id === id){
                prod.extraSection = extraSections
              } return prod;
            }))
        } catch (err) {
          console.log(err);
        }
      }
      
      
  return (
    <tr className={styles.tr_title}>
    <td className={styles.unavailable} onClick={()=>setShowButtons(!showButtons)}>{product.available ? null : "x"}</td>
    <td className={styles.text} onClick={()=>setShowButtons(!showButtons)}>..{product._id.slice(-3)}</td>
    <td className={styles.text} onClick={()=>setShowButtons(!showButtons)}>{product.title}</td>
    <td className={styles.text} onClick={()=>setShowButtons(!showButtons)}>{product.price === 0 ? "Free" : product.price.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</td>
    <td>
      {showButtons ? 
        <div className={styles.btn_container}>
          <button className={styles.btn_available} style={{color: product.available ? '#00b20f' : '#7a7a7a', opacity: product.available ? "1" : "0.5"}} onClick={() => handleAvailable(product._id)}>available</button>
          <button onClick={()=>handleDelExtra(product._id)}>- Extra</button>
          <button className={styles.btn_delete} onClick={() => handleDel(product._id)}>Delete</button>
        </div>
        : <button className={styles.btn_show} onClick={()=>setShowButtons(true)}>Options</button>}
    </td>
</tr>
  )
      }

export default ManageExtra