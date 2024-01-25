import { useRouter } from "next/router"
import styles from '../../styles/locationComp.module.css'
import {useSettings} from "../../context/settingsContext"
import { useState } from "react";

export default function LocationComp() {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const {setAlert, setAlertDetails} = useSettings();
    const handleLocationChange = () => {
        setAlertDetails({
          header: "Confirm",
          message: "Changing location will reset your basket to empty. Please confirm you wish to do this.",
          type: "confirm",
          onClose: ()=>setAlert(false),
          onConfirm: ()=>changeLocation(),
        });
        setAlert(true);
      }
      const changeLocation = () => {
          localStorage.setItem("Orders", "[]");
          router.push("/")
      }

      function handleHover(){
        setIsHovered(!isHovered)
      }
  return (
    <div className={styles.locationsContainer}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}>
        <div className={styles.location}><p>Branch:</p><p>{router.query.location}</p></div>
        {
          isHovered ? 
        <p
         className={styles.changeLocationText}
         onClick={() => handleLocationChange()}
         >
          Wrong Store? <br/> (Change Location)
        </p>

          : null
        }
        </div>
  )
}
