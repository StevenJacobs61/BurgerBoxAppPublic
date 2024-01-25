import React from 'react'
import styles from '../../styles/product.module.css'

export default function Extras({extras, setFunction, changePrice, extraOptions}) {

  const handleToppings = (extra) => {
    const incl = extraOptions.some((ex)=> ex._id === extra._id)
    if(!incl){
      changePrice(extra.price)
      setFunction((prev) => [...prev, extra])
    } else{
      changePrice(-extra.price),
      setFunction((prev)=> prev.filter((ex) => ex._id !== extra._id));
    }
  }
  return (
    extras.map((extra) => extra.available === true ?
        <div key={extra._id}className={styles.topping_container}>
          <h3 className={styles.topping}>{extra.title}</h3>
          <div className={styles.price_wrapper}> 
            <input className={styles.toppingCheckbox} type="checkbox" onClick={()=>handleToppings(extra)}/>
            {extra.price > 0 ? <p className={styles.toppingPrice}>{extra.price.toLocaleString("en-US", {style: "currency", currency: "GBP"})}</p> 
            : <p className={styles.toppingPrice}>Free!</p> }
          </div>
        </div>
      : null)
  )
}
