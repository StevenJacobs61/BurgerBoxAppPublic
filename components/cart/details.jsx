import React from 'react'
import styles from '../../styles/checkout.module.css'
import verifySeafordPostcode from '../../functions/verifyPostcode'
import { useSettings } from '../../context/settingsContext'
import { useRouter } from 'next/router';

export default function Details({setDetails, postcodeRef, showDeliver}) {
    const {setAlert, setAlertDetails} = useSettings();
    const router = useRouter();

    function handleDetails(e){
        e.preventDefault();
        let {name, value} = e.target;
        setDetails((prev) => {
            if(name in prev?.address){
                return {
                    ...prev,
                    address: {
                        ...prev.address,
                        [name]: value
                    }
                };
            }else if(name in prev){
                return {
                    ...prev,
                    [name]: value,
                };
            };
        });
    };

  return (
    <div className={styles.details_container}>

        <label htmlFor="" className={styles.details_label}>Full Name</label>
        <input type="text" id='name' name='name' placeholder='' className={styles.details_input}
        onChange={(e) => handleDetails(e)}
        />

        {showDeliver && 
        <>
        <label htmlFor="" className={styles.details_label}>Street Address</label>
        <input type="text" placeholder='' id='street' name='street' className={styles.details_input}
        onChange={(e) => handleDetails(e)}
        />

        <label htmlFor="" className={styles.details_label}>Postcode</label>
        <input type="text" ref={postcodeRef} 
        placeholder={router.query.location === "Seaford" ? "BN9, BN10, BN25 or BN26" : "BN20, BN21 or BN22"} 
        id='postcode' name='postcode' className={styles.details_input_postcode}
        onChange={(e) => handleDetails(e)} 
        onBlur={async()=> await verifySeafordPostcode(setAlert, setAlertDetails, postcodeRef)}
        />
        
        <label htmlFor="" className={styles.details_label}>Delivery Instrutions</label>
        <textarea type="text" placeholder='' name="instructions"
        className={styles.instructions} onChange={(e) => handleDetails(e)}
        />
        </>
        }

        <label htmlFor="" className={styles.details_label}>Phone Number</label>
        <input type="text" placeholder='' id='number' name='number' className={styles.details_input}
        onChange={(e) => handleDetails(e)}
        />

        <label htmlFor="" className={styles.details_label}>Email</label>
        <input type="email" placeholder='' id='email' name='email' className={styles.details_input}
        onChange={(e) => handleDetails(e)}
        />
    </div>
  )
}
