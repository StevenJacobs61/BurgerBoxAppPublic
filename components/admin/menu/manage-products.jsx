import React from 'react'
import styles from '../../../styles/manage-products.module.css'
import { useState } from 'react'
import ManageSection from './manage-section'
import EditSections from './edit-sections'

const ManageProducts = ({productsList, sectionsList, setAlert, setAlertDetails}) => {

    const [sections, setSections] = useState(sectionsList);
    const [products, setProducts] = useState(productsList);
    
    
  return (
    <div className={styles.container}>
      <EditSections 
      setSections={setSections} 
      sections={sections}
      {...{setAlert, setAlertDetails}}/>              
      {sections.map((section) =>  (section ? 
      <ManageSection 
      key={section._id} 
      section={section} 
      sections={sections} 
      setSections={setSections} 
      products={products} 
      setProducts={setProducts}
      {...{setAlert, setAlertDetails}}/> 
      : null))}
    </div>
  )
}

export default ManageProducts