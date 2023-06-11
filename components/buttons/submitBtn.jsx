import React from 'react'
import styles from "../../styles/buttons/submitBtn.module.css"

const SubmitBtn = ({ btnFunction, fProps}) => {
  return (
    <button className={styles.btn} onClick={()=>btnFunction(fProps)} >submit</button>
  )
}

export default SubmitBtn