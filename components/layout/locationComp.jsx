import { useRouter } from "next/router"
import styles from '../../styles/navbar.module.css'
import {useAlert} from "../../context/alertContext"

export default function LocationComp() {
    const router = useRouter();
    const {setAlert, setAlertDetails} = useAlert();
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
  return (
    <div className={styles.locationsContainer}>
        <div className={styles.location}><p>Branch:</p><p>{router.query.location}</p></div>
        <div className={styles.changeLocation}><p className={styles.changeLocationText} onClick={()=>handleLocationChange()}>Wrong Store? (Change Location)</p></div>
        </div>
  )
}
