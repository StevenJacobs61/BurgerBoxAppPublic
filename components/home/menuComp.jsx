import React, { useEffect, useState } from 'react'
import styles from '../../styles/menu.module.css'
import MenuSection from '../menu_section'
import { useMenu } from '../../context/menuContext'
import ItemsContainer from './itemContainer'
import ToCart from './toCart'

export default function MenuComp() {

    const [currentSection, setCurrentSection] = useState();
    const {sections} = useMenu();

    useEffect(() => {
    if(!currentSection){
        setCurrentSection(sections[0])
    }
    }, [])
    
  return (
    <div className={styles.menu_container}>
        <div className={styles.sections_container}>
            {sections.map((section) =>
            <MenuSection key={section._id} 
            setCurrentSection={setCurrentSection} 
            currentSection={currentSection} 
            section={section}
            />
            )}
            <ToCart/>
        </div>
        {/* Large screen item container */}
        <ItemsContainer currentSection={currentSection}/>
    </div>
  )
}
