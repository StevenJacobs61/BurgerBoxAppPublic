import React, { useEffect } from 'react'
import styles from '../../../styles/list-item.module.css'
import { useState } from 'react'

// const ListItem = ({ order, handleData, showItem }) => {
//   const [status, setStatus] = useState(order?.status);
//   const [timer, setTimer] = useState();
//   const [intervalId, setIntervalId] = useState(null);

//   useEffect(() => {
//     const acceptedDate = new Date(order?.acceptedAt);
//     const targetTime = new Date(acceptedDate.getTime() + order.time * 60 * 1000);
//     const currentTime = new Date();

//     if (currentTime > targetTime) {
//       setTimer("Due");
//     } else {
//       const interval = setInterval(() => {
//         const remainingTime = targetTime - new Date();

//         if (remainingTime <= 0) {
//           clearInterval(intervalId);
//           if (isPastDate(order?.acceptedAt)) {
//             setTimer("Expired");
//           } else {
//             setTimer("Due");
//           }
//         } else {
//           const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
//           setTimer(minutes >= 0 ? minutes : "Due");
//         }
//       }, 1000);
//       setIntervalId(interval);
//     }

//     return () => clearInterval(intervalId);
//   }, [order]);

//   const isPastDate = (date) => {
//     const acceptedDate = new Date(date);
//     const currentDate = new Date();

//     // Set hours, minutes, seconds, and milliseconds to 0
//     acceptedDate.setHours(0, 0, 0, 0);
//     currentDate.setHours(0, 0, 0, 0);

//     return acceptedDate < currentDate;
//   };
const ListItem = ({ order, handleData, showItem }) => {
  const [status, setStatus] = useState(order?.status);
  const [timer, setTimer] = useState();
  const [time, setTime] = useState();

  useEffect(() => {
    const acceptedTime = new Date(order?.acceptedAt);
    const totalTime = order.time * 60 * 1000; // Convert order time to milliseconds
    const endTime = acceptedTime.getTime() + totalTime; // Calculate end time
    setTime(endTime); // Set the end time for the timer
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = time - new Date().getTime(); // Calculate the remaining time in milliseconds

      if (remainingTime <= 0 && isPastDate(order?.acceptedAt)) {
        setTimer("Expired");
      } else {
        const minutes = Math.ceil(remainingTime / (60 * 1000)); // Convert remaining time to minutes
        setTimer(minutes >= 0 ? minutes : remainingTime <= 0 ? "Due" : "Expired");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  
    const isPastDate = (date) => {
      const acceptedDate = new Date(date);
      const currentDate = new Date();
  
      // Set hours, minutes, seconds, and milliseconds to 0
      acceptedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
  
      return acceptedDate < currentDate;
    };
  
  return (
    <>
        <tbody>
          <tr className={styles.tr_title} >
            <td onClick={() => showItem(order)} className={styles.title_item}>{order._id.slice(21, 24)}</td>
          {order.status === 2 ? <td onClick={() => showItem(order)} className={styles.title_item} style={{color: "var(--text--dark-red)", transform: "scale(1.5)"}}>{timer}</td> : null}
            <td>
             <ul className={styles.title_list}onClick={() => showItem(order)}>
               {order.orders.map((order) => 
              <div key={order.id}>
                <li className={styles.title_item}>{order.product.title}</li>
              {order.extraOptions.map((extra) => 
              <li key={Math.random(1000)} className={styles.extra}>{extra.title}</li>)}
              {order.extraUpgrades.map((upgrade) => 
              <li key={Math.random(1000)} className={styles.upgrade}>{upgrade.title}</li>)} 
               </div>)}
             </ul>
            </td>
            {/* <td onClick={() => showItem(order)} className={styles.title_item}>£{order.total} <br/> {order.refunded > 0 ? `-£${order.refunded}` : null}</td> */}
            {/* <td onClick={() => showItem(order)} className={styles.title_item}>{order.delivery ? 'D' : 'C'}</td> */}
            <td>
            {status === 0 ? 
            <div className={styles.btn_container}>
              <button
              className={styles.btn_del}
              onClick={() => handleData("delete", order)}>
               Delete
              </button>
            </div>
            : status === 1 ? 
            <div className={styles.btn_container}>
              <button 
              className={styles.btn_accept} 
              onClick={() => handleData("accept", order)}>
               Accept
              </button>
              <button 
              className={styles.btn_del} 
              onClick={() => handleData("decline", order)}>
               Decline
              </button>
            </div>
            : status === 2 ?
            <div className={styles.btn_container}>
              <button
              className={styles.btn_complete}
              onClick={() => handleData("complete", order)}>
                complete
              </button>
            </div>
            : status === 3 ?
            <div className={styles.btn_container}>
              <button
              className={styles.btn_complete}
              onClick={() => handleData("history", order)}>
               History
              </button>
            </div>
            : status === 4 ?
            <div className={styles.btn_container}>
              <button
              className={styles.btn_del}
              onClick={() => handleData("delete", order)}>
               Delete
              </button>
            </div>
          :null}
          </td>
          </tr>
        </tbody>
      </>
  )
}

export default ListItem