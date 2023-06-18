import React from 'react'
import styles from '../../../styles/manage-section.module.css'
import { useState } from 'react'
import ManageProduct from './manage-product'
import Add from './add'
import axios from 'axios'
import ManageExtras from './manage-extras'
import Show from '../../show'
import { useRouter } from 'next/router'

const ManageSection = ({section, sections, products, setProducts, setSections, setAlert, setAlertDetails}) => {
  
  const[showProducts, setShowProducts] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const router = useRouter();

  const handleAvailable = async () => {
    const id = section._id;
      const newData = {
       available: !section.available
      }
     try{
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sections/` + id, newData, {
          params:{
            location:router.query.location
          }
        })
        setSections(sections.map((sect) => {
          if (sect._id === section._id) {
            sect.available = !sect.available;
          } return sect;
        }))
     }catch(err){
         console.log(err);
         setAlertDetails({
          header: "Alert",
          message: "There was an error whilst updating this section. Please reload the page and try again.",
          type: "alert",
          onClose: ()=>setAlert(false),
          onConfirm: null,
        });
        setAlert(true);
     }
    };
   
  return (
    <div className={styles.container}>
    <div className={styles.title_container} style={{background: section.available ? '#fff' : '#cccaca'}}>
      <h1 className={styles.header} onClick={() => setShowProducts(!showProducts)}>{section.title}</h1>
<div className={styles.btn_container}>
  <button className={styles.btn_add} onClick={() => setShowAdd(true)}>Add <br/> Product</button>
  <button className={styles.btn_available} 
  style={{color: section.available ? '#00b20f' : '#cccaca'}} onClick={() => handleAvailable()}>{section.available ? 'Available' : 'Unavailable'}</button>
</div>
</div>
   {showProducts ? <table className={styles.table}>
      <tbody>
        <tr className={styles.tr_title}>
          <th>Image</th>
          <th>ID</th>
          <th>Title</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </tbody>
      <tbody className={styles.table}>
      {section.title !== "Upgrades" &&
        products
          .filter((product) => product.section === section.title)
          .map((product) => (
            <ManageProduct
              key={product._id}
              product={product}
              sections={sections}
              setProducts={setProducts}
              products={products}
              upgrade={false}
              {...{ setAlert, setAlertDetails }}
            />
          ))}
          {section.title === "Upgrades" &&
        products
          .filter((product) => product.upgrade)
          .map((product) => (
            <ManageProduct
              key={product._id}
              product={product}
              sections={sections}
              setProducts={setProducts}
              products={products}
              upgrade={true}
              {...{ setAlert, setAlertDetails }}
            />
          ))}
        {/* {products.map((product) =>
      (product?.section === section.title ? 
      <ManageProduct  key={product._id} product={product} 
      sections={sections} 
      setProducts={setProducts}
      products={products}
      {...{setAlert, setAlertDetails}}
      />: null))} */}
      {products.some((product) => product.extraSection?.includes(section.title)) ? 
      <tr>
        <td>
          <h3 className={styles.hdr_extras} onClick={() => setShowExtras(!showExtras)}>extras</h3>
        </td>
      </tr> 
    : null}
      {showExtras ? products?.map((product) => 
      product?.extraSection?.some((extraSection) => 
      extraSection === section.title) ?
      <ManageExtras 
      key={product._id} 
      setProducts={setProducts}
      product={product} 
      products={products} 
      section={section}
      {...{setAlert, setAlertDetails}}/>
: null) : null}
     </tbody>
    </table> : null}
    {showAdd ? 
    <Show 
      setShow={setShowAdd}>
      <Add
      section={section}
      setProducts={setProducts}
      setShow={setShowAdd}
      {...{setAlert, setAlertDetails}}
      /> 
    </Show>
    : null} 
  </div>

  )
}

export default ManageSection