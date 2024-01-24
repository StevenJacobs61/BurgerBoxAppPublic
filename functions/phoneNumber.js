import { isMobile } from "react-device-detect";

export const handlePhoneNumberAction = (phoneNumber) => {
    console.log(isMobile);
    if (isMobile) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      navigator.clipboard.writeText(phoneNumber)
        .then(() => alert('Phone number copied to clipboard'))
        .catch((err) => console.error('Unable to copy to clipboard', err));
    }
  };