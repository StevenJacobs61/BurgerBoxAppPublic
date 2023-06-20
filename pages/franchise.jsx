import React, {useRef, useState} from 'react'
import styles from "../styles/franchise.module.css"
import emailjs from '@emailjs/browser';

const Franchise = () => {
    const [status, setStatus] = useState('');

    const form = useRef();
    
    const sendEmail = (e) => {
        e.preventDefault();
        setStatus("Sending...")
        emailjs.sendForm(`${process.env.NEXT_PUBLIC_SERVICE_ID}`, `${process.env.NEXT_PUBLIC_TEMPLATE_ID}`, form.current, `${process.env.NEXT_PUBLIC_PUBLIC_KEY}`)
          .then((result) => {
              console.log(result.text);
              setStatus('Success!')
              form.current.reset();
          }, (error) => {
              console.log(error.text);
              setStatus("Error, please try again.")
          });
      };

  return (
    <div className={styles.container}>
        <div className={styles.wrapper}>
            <h1 className={styles.hdr}>Join our Franchise</h1>
            <p className={styles.text}>Complete the contact form below to enquire about opening your own BurgerBox store or joining one of our existing teams. Include a contact number to request a call back and discuss about starting your exciting venture with us!</p>
            <div className={styles.formWrapper}>
                <h2 className={styles.contactHdr}>Contact Form</h2>
                {status && <p className={styles.statusText}>{status}</p>}
                <form onSubmit={sendEmail} ref={form} className={styles.form}>
                    <label className={styles.label}>
                    Name:
                    </label>
                    <input
                        type="text"
                        name="user_name"
                        className={styles.inputField}
                        required
                    />
                    <label className={styles.label}>
                    Email:
                    </label>
                    <input
                        type="email"
                        name="user_email"
                        className={styles.inputField}
                        required
                    />
                    <label className={styles.label}>
                    Message:
                    </label>
                    <textarea
                        name="message"
                        className={styles.textArea}
                        required
                    ></textarea>
                    <input 
                        type="submit" 
                        value="Send"
                        className={styles.btn}/>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Franchise


export const getServerSideProps = async (context) => {
    const { query, req } = context;
    const location = query.location;
    const myCookie = req?.cookies || "";
  
    let token = 
        location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
      : location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
      : null;
  
    if (myCookie.token === token){
      const locationQuery = {
        location: location
      };
      const queryString = new URLSearchParams(locationQuery).toString();
      return {
        redirect: {
          destination: `/admin/orders?${queryString}`,
          permanent: false,
        },
      };
    }else{
        return {
            props:{}
        }
    }
}
  