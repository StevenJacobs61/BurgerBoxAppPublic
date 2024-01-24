import React from 'react'
import styles from '../../styles/menu.module.css'
import { useMenu } from '../../context/menuContext';
import MenuItem from '../menu_item';

export default function ItemsContainer({currentSection}) {
    const {products} = useMenu();
  return (
    <div className={styles.items_container}>
              <h2 className={styles.menu_hdr}>{currentSection?.title}</h2>
              <div className={styles.items_wrapper}>
              {products.filter((i) => i.section === currentSection?.title).map((item)=>
                <MenuItem key={item._id} 
                item={item} 
                section={currentSection} 
                />
              )}  
              </div>
            </div>
  )
}
