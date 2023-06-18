import React, { useState } from 'react'
import styles from '../../../styles/add.module.css'
import axios from 'axios';
import SubmitBtn from '../../buttons/submitBtn';
import InputField from '../../inputs/input_field';
import { useRef } from 'react';
import { useRouter } from 'next/router';

const Add = ({section, setProducts, setShow, setAlert, setAlertDetails}) => {
  const router = useRouter();

  // Set info of new product on input change

  const title = useRef()
  const desc = useRef()
  const stripeId = useRef()
  const price = useRef()
  const img = useRef()
  const [veg, setVeg] = useState(false)

  // ** Submit new product to entry to MDB

  const handleAddProduct = async () => {
    const newProduct = {
      img: img.current?.value,
      title: title.current?.value,
      desc: desc?.current.value,
      price: price.current?.value,
      section: section.title,
      veg: veg,
      extraSection: [],
      stripeId: stripeId.current?.value,
      location: router.query.location
    }
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, newProduct, {
        params:{
          location:router.query.location
        }
      })
      setShow(false)
    setProducts((prev) => ([...prev, res.data]))
    } catch (error) {
      console.log(error);
      setAlertDetails({
        header: "Alert",
        message: "There was an error whilst adding this product. Please reload the page and try again.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setShow(false);
      setAlert(true);
    } 
  }
  
  return (
    <div className={styles.container}>
            <div className={styles.hdr_container}>
              <h1 className={styles.hdr} style={{color: "rgb(0, 145, 0)"}}>Add</h1>
              <h1 className={styles.hdr}> to {section.title}</h1>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Title:</label>
              <div className={styles.input_wrapper}>
                <InputField cRef={title} type={"text"}/>
              </div>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Price:</label>
              <div className={styles.input_wrapper}>
                <InputField cRef={price} type={"number"}/>
              </div>
            </div>
           <div className={styles.input_container}>
              <label className={styles.label}>IMG:</label>
              <div className={styles.input_wrapper}>
                <InputField cRef={img} type={"text"}/>
              </div>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Description:</label>
              <div className={styles.input_wrapper}>
                <InputField cRef={desc} type={"text"}/>
              </div>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Vegetarian:</label>
              <div className={styles.input_wrapper}>
                <input type='checkbox' className={styles.veg} onClick={() => setVeg(!veg)}/>
              </div>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Stripe-ID:</label>
              <div className={styles.input_wrapper}>
                <InputField cRef={stripeId} type={"text"}/>
              </div>
            </div>
              <button className={styles.btn} onClick={()=> handleAddProduct()}>Submit</button>
        </div>
  )
}

export default Add