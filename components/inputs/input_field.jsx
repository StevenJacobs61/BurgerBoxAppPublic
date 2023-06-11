import React from 'react'
import styles from "../../styles/inputs/input_field.module.css"

const InputField = ({plHolder, type, cRef}) => {
  return (
    <input ref={cRef} className={styles.input} placeholder={plHolder} type={type}></input>
  )
}

export default InputField