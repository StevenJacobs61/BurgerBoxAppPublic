import styles from '../../../styles/add-section.module.css'
import React from 'react'
import axios from 'axios'
import { useRef } from 'react'
import InputField from '../../inputs/input_field'
import { useRouter } from 'next/router'

const AddSection = ({setSections, setShow, setAlert, setAlertDetails}) => {
    const title = useRef();
    const router = useRouter();

  const handleAddSection = async () => {
    const newSection = {
      title: title.current.value,
      location: router.query.location
    }
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sections`, newSection)
      setSections((prev) => ([...prev, res.data]))
      setShow(false)
    } catch (error) {
      console.log(error);
      setAlertDetails({
        header: "Alert",
        message: "There was an error whilst adding this section. Please reload the page and try again.",
        type: "alert",
        onClose: ()=>setAlert(false),
        onConfirm: null,
      });
      setAlert(true);
    }
  }

  return (
    <div className={styles.container} >
      <h1 className={styles.hdr}>Add Section</h1>
        <div className={styles.input_container}>
          <label className={styles.label}>Title:</label>
          <InputField type={"text"} cRef={title}/>
        </div>
      <div className={styles.btn_container}>
        <button className={styles.btn} onClick={()=>handleAddSection()}>Submit</button>
      </div>
    </div> 
  )
}



export default AddSection