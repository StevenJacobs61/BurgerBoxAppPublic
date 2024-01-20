import axios from "axios";

export default async function verifySeafordPostcode(setAlert, setAlertDetails, postcodeRef){
    let showAlert = false;
    let success = false;
    let outcode = null;
    if(!postcodeRef.current.value){
      setAlertDetails({
        header: "Alert",
        message: "Please complete all fields correctly.",
        type: "alert",
        onClose: setAlert,
        onConfirm: null,
      });
      setAlert(true)
      return;
    }
    const cleanedPostcode = postcodeRef.current.value.replace(/\s/g, '').toLowerCase();
    try {
      const postcodeRes = await axios.get(`https://api.postcodes.io/postcodes/${cleanedPostcode}`);
      outcode = postcodeRes.data.result.outcode.toLowerCase();
      if (outcode !== 'bn9' && outcode !== 'bn10' && outcode !== 'bn25' && outcode !== 'bn26') {
        setAlertDetails({
          header: "Alert",
          message: "We do not deliver to this postcode.",
          type: "alert",
          onClose: setAlert,
          onConfirm: null,
        });
        setAlert(true)
        showAlert = true;
        postcodeRef.current.value = "";
        return success = false;
      }
     success = true;
    } catch (error) {
      console.error(error);
      setAlertDetails({
        header: "Alert",
        message: "Please enter a valid postcode.",
        type: "alert",
        onClose: setAlert,
        onConfirm: null,
      });
      setAlert(true)
      showAlert = true;
      postcodeRef.current.value = "";
      return success = false;
    }
    return {success, outcode};
  };