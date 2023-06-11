import React from 'react'
import styles from '../../../styles/make-extra.module.css'
import axios from 'axios';
import { useState } from 'react';

const MakeExtra = ({product, products, sections, setShow, setProducts, setIsExtra, setAlert, setAlertDetails}) => {

const [currentES, setCurrentES] = useState(product.extraSection === true | product.extraSection?.length ? product.extraSection : [])

const handleAddExtra = (section) => {
    if(currentES.includes(section))
        setCurrentES(currentES.filter((ces) => ces !== section))
    else(
        setCurrentES((prev) => [...prev, section])
    )
}
console.log(currentES);
// mongoose put to change extraSections array of product
const handleAddExtras = async () => {
    const id = product._id;
    const newData = {
        extraSection: currentES,
    }
    try{
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/` + id, newData)
        setShow(false);
        if(currentES.length){
        setIsExtra(true);
        setProducts(products.map((prod) => {
            if(prod._id === id){
                prod.extraSection = currentES;
            } return prod;
        })); 
    } else if (!currentES.length){
        setProducts(products.map((prod) => {
            if(prod._id === id){
                prod.extraSection = null;
            } return prod;
        }));
        setIsExtra(false)
        }
        setShow(false)
    } catch(err){
        console.log(err);
        setAlertDetails({
            header: "alert",
            message: "There was an error whilst updating this product. Please reload the page and try again.",
            type: "alert",
            onClose: ()=>setAlert(false),
            onConfirm: null,
          });
          setAlert(true);
          return;
    }
}

  return (
 <>
            <h1 className={styles.hdr}>Manage extra</h1>
            <div className={styles.input_container}>
              <label className={styles.label_hdr}>Extra Sections:</label>
              {sections.map((section, i) => 
              <button
                className={styles.btnSection}
                key={i} 
                style={{background: currentES.includes(section.title) ? "#d3ffd9" : "#ffcdcd"}}
                onClick={()=>handleAddExtra(section.title)}>
                 {section.title}
              </button>
              )}
              {/* {
                currentES.map((ces) => 
                <button key={Math.random(10000)} className={styles.btn_current} onClick={() => handleRemoveExtra(ces)}>
                    {ces}
                </button>
                )
              }
              {
                otherES.map((oes, i) => 
                <button key={i} className={styles.btn_other} onClick={() => handleAddExtra(oes)}>
                {oes}
            </button>
                )
              } */}
            </div> 
            <div className={styles.btn_container}>
                <button className={styles.btnSubmit} onClick={()=>handleAddExtras()}>Submit</button>
            </div>
            </>
  )
}

export default MakeExtra