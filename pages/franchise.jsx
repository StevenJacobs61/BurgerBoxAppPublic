import React, {useState} from 'react'
import styles from "../styles/franchise.module.css"

const Franchise = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    
    const handleSubmit = async(e)=>{
        e.preventDefault();
    }

  return (
    <div className={styles.container}>
        <div className={styles.wrapper}>
            <h1 className={styles.hdr}>Join our Franchise</h1>
            <p className={styles.text}>Complete the contact form below to enquire about opening your own BurgerBox store, or joining one of our existing teams and start your exciting venture with us!</p>
            <div className={styles.formWrapper}>
                <h2 className={styles.contactHdr}>Contact Form</h2>
                {status && <p className={styles.statusText}>{status}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>
                    Name:
                    </label>
                    <input
                        type="text"
                        className={styles.inputField}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label className={styles.label}>
                    Email:
                    </label>
                    <input
                        type="email"
                        className={styles.inputField}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label className={styles.label}>
                    Message:
                    </label>
                    <textarea
                        value={message}
                        className={styles.textArea}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit" className={styles.btn}>Submit</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Franchise