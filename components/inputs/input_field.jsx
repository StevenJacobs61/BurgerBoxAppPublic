import React from 'react'
import styles from "../../styles/inputs/input_field.module.css"

const InputField = ({plHolder, type, cRef, def}) => {
  return (
    <input ref={cRef} className={styles.input} placeholder={plHolder} type={type} defaultValue={def}></input>
  )
}

export default InputField