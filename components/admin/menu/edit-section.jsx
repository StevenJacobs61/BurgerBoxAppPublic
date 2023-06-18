import React from 'react'
import styles from '../../../styles/edit-section.module.css'
import axios from 'axios';


const EditSection = ({section, sections, setSections, setAlert, setAlertDetails}) => {

  const handleDelete = async (id) => {
    setAlertDetails({
      header: "Are you sure?",
      message: "Please confirm that you would like to delete this section.",
      type: "confirm",
      onClose: ()=>setAlert(false),
      onConfirm: () => deleteSection(id),
    });
    setAlert(true);
  }
  
  const deleteSection = async (id) => {
      try {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/sections/` + id, {
            params:{
              location:router.query.location
            }
          }
        );
        setSections(sections.filter((sect) => sect._id !== id));
      } catch (err) {
        console.log(err);
        setAlertDetails({
          header: "Alert",
          message: "There was an error whilst deleting this section. Please reload the page and try again.",
          type: "alert",
          onClose: ()=>setAlert(false),
          onConfirm: null,
        });
        setAlert(true);
      }
  };
return(
  <tr className={styles.tr_title}>
    <td>..{section._id.slice(-3)}</td>
    <td>{section.title}</td>
    <td>
      <button className={styles.btn_delete} onClick={() => handleDelete(section._id)}>Delete</button>
    </td>
  </tr>
)
}

export default EditSection