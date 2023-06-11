import React from 'react'
import { useState } from 'react'
import styles from '../../../styles/edit-sections.module.css'
import EditSection from './edit-section';
import AddSection from './add-section';
import { useEffect } from 'react';
import axios from 'axios';
import Show from "../../show"
import { useRouter } from 'next/router';

const EditSections = ({sections, setSections, setAlert, setAlertDetails}) => {
    const router = useRouter();
    const[showSections, setShowSections] = useState(false)
    const [showAdd, setShowAdd] = useState(false);
    const [open, setOpen] = useState();

    useEffect(() => {
      const sectionClosed = sections.filter((section) => 
        !section.available);
        const isOpen = sectionClosed.length < sections.length;
      if(!isOpen){
        setOpen(false)
      };
      if (isOpen){
        setOpen(true)
      }
    }, [sections]);

    const handleAvailable = async () => {
      const newOpen = !open;
      const filter = {
        location: router.query.location
      };
      const update = {
        available:newOpen
      };
      try{
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sections`, {filter, update});
        setSections(sections.map((sect) => {
        sect.available = update.available;
        return sect;
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
    };
  };


    
  return (
    <div className={styles.container}>
      <div className={styles.title_container}>
        <h1 className={styles.header} onClick={() => setShowSections(!showSections)}>Sections</h1>
        <div className={styles.btn_container}>
          <button className={styles.btn_clear} onClick={() => setShowAdd(true)}>Add <br/>Section</button>
          <button 
            className={styles.btn_available} 
            style={{color: open ? '#106a00' : '#7c0303'}}
            onClick={() => handleAvailable()}>{open ? "Store Open" : "Store Closed"}
          </button>
        </div>
     </div>
      {showSections && 
      <table className={styles.table} >
        <tbody>
          <tr className={styles.tr_title}>
            <th>ID</th>
            <th>Title</th>
            <th>Action</th>
          </tr>
        </tbody>
        <tbody>
          {sections.map((section) => 
          <EditSection 
          key={section._id} 
          section={section} 
          setSections={setSections} 
          sections={sections}
          {...{setAlert, setAlertDetails}}/>)}
        </tbody>
      </table>}
        
      {showAdd ?  
        <Show setShow={setShowAdd}>
          <AddSection 
          setSections={setSections} 
          setShow={setShowAdd}
          {...{setAlert, setAlertDetails}}/> 
        </Show>
      : null}
   </div>
  )
}

export default EditSections