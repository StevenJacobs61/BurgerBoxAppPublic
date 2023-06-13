import React from 'react'
import styles from "../../../styles/admin/settings/settings.module.css"
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import Printer from './printer'
import Show from '../../show'
import { useRouter } from 'next/router'

const Settings = ({settingsList, admins, setAlert, setAlertDetails}) => {
    const router = useRouter();

    const [settings, setSettings] = useState(settingsList)
    const [accounts, setAccounts] = useState(admins);
    const [banner, setBanner] = useState(settings.banner);
    const [notice, setNotice] = useState(settings.notice);
    const [delTime, setDelTime] = useState(settings.delTime);
    const [discountActive, setDiscountActive] = useState(settings.discount.active);
    const [discountApplied, setDiscountApplied] = useState(settings.discount.applied);
    const [discountMessage, setDiscountMessage] = useState(settings.discount.message);
    
 
    const[show, setShow] = useState({
        times:false,
        offline:false,
        banner:false,
        notice:false,
        accounts:false,
        delivery:false,
        discounts:false,
        printer:false
    })

    const filter = {
        location: router.query.location
     }

    const handleSubmit = async () => {
        const update = {
            colTime: parseInt(!colTime || colTime < 1 ? settings.colTime : colTime),
            delTime: parseInt(!delTime || delTime < 1 ? settings.delTime : delTime)
         };
        try{
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, {filter, update})
        setSettings({...settings, colTime:parseInt(update.colTime), delTime:parseInt(update.delTime)})
        setShow({...show, times:false})
        } catch(err){
            console.log(err);
            setAlertDetails({
                header: "Alert",
                message: "There was an error whilst updating this setting. Please reload the page and try again",
                type: "alert",
                onClose: ()=>setAlert(false),
                onConfirm: null,
              });
              setAlert(true);
              return;
        }
    }

    const handleOffline = async () => {
        const update = {
            offline:!settings.offline
        };
        try{
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, {filter, update});
        setSettings({...settings, offline:!settings.offline})
        setShow({...show, offline:false})
        } catch (err){
            console.log(err);
            setAlertDetails({
                header: "Alert",
                message: "There was an error whilst updating this setting. Please reload the page and try again",
                type: "alert",
                onClose: ()=>setAlert(false),
                onConfirm: null,
              });
              setAlert(true);
              return;
            
        }
    }

    const handleBannerUpdate = async () => {
        const newBanner = !banner ? settings.banner : banner;
        const update = {
            banner: newBanner
        };
        try{
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, {filter, update});
        setSettings({...settings, banner:newBanner});
        setShow({...show, banner:false})
        }catch(err) {
            console.log(err);
            setAlertDetails({
                header: "Alert",
                message: "There was an error whilst updating this setting. Please reload the page and try again",
                type: "alert",
                onClose: ()=>setAlert(false),
                onConfirm: null,
              });
              setAlert(true);
              return;
        }
    }

    const handleBanner = async () => {
        const update = {
            bannerOn: !settings.bannerOn
        };
       
        try{
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, {filter, update});
            setSettings({...settings, bannerOn:!settings.bannerOn})
            }catch(err) {
                console.log(err);
                setAlertDetails({
                    header: "Alert",
                    message: "There was an error whilst updating this setting. Please reload the page and try again",
                    type: "alert",
                    onClose: ()=>setAlert(false),
                    onConfirm: null,
                  });
                  setAlert(true);
                  return;
            }
    }

    const handleNoticeUpdate = async () => {
        const update = {
            notice: !notice ? settings.notice : notice
        };
        try{
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, {filter, update});
        setSettings({...settings, notice:update.notice})
        setShow({...show, notice:false})
        }catch(err) {
            console.log(err);
            setAlertDetails({
                header: "Alert",
                message: "There was an error whilst updating this setting. Please reload the page and try again",
                type: "alert",
                onClose: ()=>setAlert(false),
                onConfirm: null,
              });
              setAlert(true);
              return;
        }
    }

    const handleNotice = async () => {
        const update = {
            noticeOn: !settings.noticeOn
        };
        try{
            const res = await axios.patch("/api/settings", {filter, update});
            setSettings({...settings, noticeOn:!settings.noticeOn})
        }catch(err) {
            console.log(err);
            setAlertDetails({
                header: "Alert",
                message: "There was an error whilst updating this setting. Please reload the page and try again",
                type: "alert",
                onClose: ()=>setAlert(false),
                onConfirm: null,
                });
            setAlert(true);
            return;
        }
    }

    const handleDelivery = async () => {
        const update = {
            del:!settings.del
        };
        try{
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, {filter, update});
        setSettings({...settings, del:!settings.del})
        setShow({...show, delivery:false})
        } catch (err){
            console.log(err);
            setAlertDetails({
                header: "Alert",
                message: "There was an error whilst updating this setting. Please reload the page and try again",
                type: "alert",
                onClose: ()=>setAlert(false),
                onConfirm: null,
              });
              setAlert(true);
              return;
        }
    }
    const handleDiscounts = async () => {
        const update = {
            discount:{
                active: discountActive,
                message: discountMessage,
                applied: discountApplied,
            }
        }
        try{
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings`, {filter, update});
            setSettings({...settings, ...update})
            setShow({...show, discounts:false})
            } catch (err){
                console.log(err);
                setAlertDetails({
                    header: "Alert",
                    message: "There was an error whilst updating this setting. Please reload the page and try again",
                    type: "alert",
                    onClose: ()=>setAlert(false),
                    onConfirm: null,
                  });
                  setAlert(true);
                  return;
            }
    }

    const [match, setMatch] = useState(false)
    const[username, setUsername] = useState()
    const[password, setPassword] = useState()
    const[newUsername, setNewUsername] = useState()
    const[newPassword, setNewPassword] = useState()

    const handleAccountDelete = async (id) => {
        if (accounts.length < 2){
            setAlertDetails({
                header: "Alert",
                message: "Admin must have at least one user.",
                type: "alert",
                onClose: ()=>setAlert(false),
                onConfirm: null,
              });
              setAlert(true);
              return;
        }else{
        setAlertDetails({
            header: "Are you sure?",
            message: "Please confirm you wish to delete this aaccount.",
            type: "confirm",
            onClose: ()=>setAlert(false),
            onConfirm: ()=>accountDelete(id),
          });
          setAlert(true);
        }
    };
    const accountDelete = async (id) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/` + id)
            setAccounts(accounts.filter((ac)=> ac._id !== id))
        } catch (err) {
            console.log(err);
            setAlertDetails({
                header: "Alert",
                message: "There was an error whilst deleting this account. Please reload the page and try again.",
                type: "alert",
                onClose: ()=>setAlert(false),
                onConfirm: null,
            });
            setAlert(true);
            return;
        };
    };

    const handleAddAccount = async () => {
        const data = {
            username: newUsername,
            password: newPassword,
            location: router.query.location
           }; 
        const existingAccount = accounts.find(
        (account) =>
            account.username === newUsername &&
            account.password === newPassword &&
            account.location === router.query.location
        );
        if (existingAccount) {
        setAlertDetails({
            header: "alert",
            message:
            "This username is already in use. Please use different credentials.",
            type: "alert",
            onClose: () => setAlert(false),
            onConfirm: null,
        });
        setAlert(true);
        return;
        }   
       try{
         const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin`, data)
         setAccounts((prev) => ([...prev, res.data]))
     } catch(err) {
         console.log(err),
         setAlertDetails({
            header: "Alert",
            message: "There was an error whilst adding this account. Please reload the page and try again.",
            type: "alert",
            onClose: ()=>setAlert(false),
            onConfirm: null,
        });
        setAlert(true);
        return;
           }
       };
    
    // Set Admins Match

    useEffect(()=> {
        const usernameMatch = false
        const passwordMatch = false
        accounts?.map((ad) => {
            if(ad.username === username){
                usernameMatch = true
            }
            if(ad.password === password){
                passwordMatch = true
            }
            if(passwordMatch && usernameMatch){
                setMatch(true)
            }else{
                setMatch(false)
            }
        })
    },
    [username, password, accounts])
    
    const margin = "2rem 0 1.5rem" 

  return (
    <div className={styles.container}>

        {/* Times */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShow({...show, times:!show.times})}
            style={{margin: !show.times ? margin : null}}
            >Times</h1>
            {show.times ? 
            <Show setShowObject={()=>setShow({...show, times:false})}>
            <div className={styles.wrapper}>
            <h2 className={styles.box_hdr}>Times</h2>
            <div className={styles.time_wrapper}>
                <h2 className={styles.time_text}>Collection Time:</h2>
                <p className={styles.time}>{settings.colTime} mins</p>
                <h3 className={styles.update_text}>Update Time</h3>
                <input type="number" className={styles.time_input} onChange={(e) => setColTime(e.target.value)}/>
            </div> 
            <div className={styles.time_wrapper} id={styles.del}>
                <h2 className={styles.time_text}>Delivery Time:</h2>
                <p className={styles.time}>{settings.delTime} mins</p>
                <h3 className={styles.update_text}>Update Time</h3>
                <input type="number" className={styles.time_input} onChange={(e) => setDelTime(e.target.value)}/>
            </div>
            <button className={styles.btn} onClick={()=> handleSubmit()}>Submit</button>
            </div>
            </Show>
            : null}
        </div>

        {/* Offline */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShow({...show, offline:!show.offline})}
            style={{margin: !show.offline ? margin : null}}
            >Offline</h1>
            {show.offline ?
            <Show setShowObject={()=>setShow({...show, offline:false})}>
            <div className={styles.wrapper}>
                <h2 className={styles.box_hdr}>Offline</h2>
            <h2 className={styles.time_text}>Current status:</h2>
            <p className={styles.time} style={{color: !settings.offline ? "var(--text--light-green)" : ""}} >{settings.offline ? "Offline" : "live"}</p>
            <h3 className={styles.update_text}>Update status</h3>
            <button className={styles.btn_offline} 
            onClick={()=> handleOffline()}
            style={{color: !settings.offline ? "rgb(109, 109, 109)" : "var(--text--light-green)"}}>{settings.offline ? "+ " : "- "}Live</button>
            </div>
            </Show>
            : null}
        </div>

        {/* Banner */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShow({...show, banner:!show.banner})}
            style={{margin: !show.banner ? margin : null}}
            >Banner</h1>
             {show.banner ?
            <Show setShowObject={()=>setShow({...show, banner:false})}>
            <div className={styles.wrapper}> 
            <h2 className={styles.box_hdr}>Banner</h2>
            <h2 className={styles.time_text}>Current status:</h2>
            <p className={styles.time} style={{color: settings.bannerOn ? "var(--text--light-green)" : ""}} >{settings.bannerOn ? "Banner On" : "Banner Off"}</p>
            <h3 className={styles.update_text}>Update status</h3>
            <button className={styles.btn_status} 
            onClick={()=> handleBanner()}
            style={{color: settings.bannerOn ? "rgb(109, 109, 109)" : "var(--text--light-green)"}}>{settings.bannerOn ? "OFF" : "On"}</button>  
             <h2 className={styles.time_text}>Current Banner:</h2>
             <p className={styles.current_text}>&quot;{settings.banner}&quot;</p>
             <h3 className={styles.update_text}>Update Banner</h3>
            <textarea type="text" className={styles.banner_input} onChange={(e) => setBanner(e.target.value)}/>
            <button className={styles.btn} onClick={()=> handleBannerUpdate()}>Submit</button>
            </div>
            </Show>
            : null}
        </div>

        {/* Notice */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShow({...show, notice:!show.notice})}
            style={{margin: !show.notice ? margin : null}}
            >notice</h1>
        {show.notice ?  
        <Show setShowObject={()=>setShow({...show, notice:false})}>
         <div className={styles.wrapper}> 
         <h2 className={styles.box_hdr}>Notice</h2>
            <h2 className={styles.time_text}>Current status:</h2>
            <p className={styles.time} style={{color: settings.noticeOn ? "var(--text--light-green)" : ""}} >{settings.noticeOn ? "Notice On" : "Notice Off"}</p>
            <h3 className={styles.update_text}>Update status</h3>
            <button className={styles.btn_status} 
            onClick={()=> handleNotice()}
            style={{color: settings.del ? "rgb(109, 109, 109)" : "var(--text--light-green)"}}>{settings.noticeOn ? "OFF" : "On"}</button>
            <h2 className={styles.time_text}>Current Notice:</h2>
             <p className={styles.current_text}>&quot;{settings.notice}&quot;</p>
             <h3 className={styles.update_text}>Update Notice</h3>
            <textarea type="text" className={styles.banner_input} onChange={(e) => setNotice(e.target.value)}/>
            <button className={styles.btn} onClick={()=> handleNoticeUpdate()}>Submit</button>
            </div> 
            </Show>
            :null}
        </div>

        {/* Delivery */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShow({...show, delivery:!show.delivery})}
            style={{margin: !show.delivery ? margin : null}}
            >Delivery</h1>
            {show.delivery ? 
            <Show setShowObject={()=>setShow({...show, delivery:false})}>
            <div className={styles.wrapper}>
            <h2 className={styles.box_hdr}>Delivery</h2>
            <h2 className={styles.time_text}>Current status:</h2>
            <p className={styles.time} style={{color: settings.del ? "var(--text--light-green)" : ""}} >{settings.del ? "Delivery On" : "Delivery Off"}</p>
            <h3 className={styles.update_text}>Update status</h3>
            <button className={styles.btn_offline} 
            onClick={()=> handleDelivery()}
            style={{color: settings.del ? "rgb(109, 109, 109)" : "var(--text--light-green)"}}>{settings.del ? "OFF" : "On"}</button>
            </div>
            </Show>
             :null}
        </div>

        {/* Discounts */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShow({...show, discounts:!show.discounts})}
            style={{margin: !show.discounts ? margin : null}}
            >discounts</h1>
        {show.discounts ?  
        <Show setShowObject={()=>setShow({...show, discounts:false})}>
         <div className={styles.wrapper}> 
         <h2 className={styles.box_hdr}>Discounts</h2>
            <h2 className={styles.time_text}>Message Status:</h2>
            <button className={styles.btn_status} 
            onClick={()=> setDiscountActive(!discountActive)}
            style={{color: !discountActive ? "rgb(109, 109, 109)" : "var(--text--light-green)"}}>{!discountActive ? "OFF" : "On"}</button>
            <h2 className={styles.time_text}>Current Message:</h2>
             <p className={styles.current_text}>&quot;{settings.discount.message}&quot;</p>
             <h3 className={styles.update_text}>Update Message</h3>
            <textarea type="text" className={styles.banner_input} onChange={(e) => setDiscountMessage(e.target.value)}/>
            <h2 className={styles.time_text}>Promo codes:</h2>
            <button className={styles.btn_status} 
            onClick={()=> setDiscountApplied(!discountApplied)}
            style={{color: !discountApplied ? "rgb(109, 109, 109)" : "var(--text--light-green)"}}>{!discountApplied ? "OFF" : "On"}</button>
            <button className={styles.btn} onClick={()=> handleDiscounts()}>Submit</button>
            </div> 
            </Show>
            :null}
        </div>

        {/* Printer */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=>setShow({...show, printer:!show.printer})}
            style={{margin: !show.printer ? margin : null}}
            >Printer</h1>
          {show.printer ? 
          <Show setShowObject={()=>setShow({...show, printer:false})}>
            <h2 className={styles.box_hdr}>Printer</h2>
              <Printer/>
          </Show>
          : null
          }
            
        </div>

        {/* Accounts */}
        <div className={styles.item}>
            <h1 className={styles.hdr} 
            onClick={()=> {setShow({...show, accounts:!show.accounts})
                    setUsername(null)
                    setPassword(null)}}
            style={{margin: !show.accounts ? margin : null}}
            >Accounts</h1>
            {show.accounts ? <div className={styles.wrapper}>
            <h2 className={styles.time_text}>{!match ? "Enter Details:" : "Current Accounts:"}</h2>
                {!match ? 
                 <div className={styles.item} style={{margin: !match && window.innerWidth < 769 ? "1rem" : null}}>
                    <div className={styles.account_details_container}>
                     <p className={styles.account_title}>UserName:</p>
                     <input type="text" placeholder="username" className={styles.account_input} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className={styles.account_details_container}>
                     <p className={styles.account_title}>Password:</p>
                     <input type="text" placeholder="password" className={styles.account_input} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                 </div>

                : <>
                {accounts.map((account) => <div  key={account._id}className={styles.account_container}>
                    <h3 className={styles.account_hdr}>Account {accounts.indexOf(account)+1}</h3>
                    <div className={styles.account_details_container}> 
                        <p className={styles.account_title}>Username:</p>
                        <p className={styles.account_info}>{account.username}</p>
                    </div>
                    <div className={styles.account_details_container}>
                        <p className={styles.account_title}>Password:</p>
                        <p className={styles.account_info}>{account.password}</p>
                    </div>
                    <button className={styles.btn_del} onClick={()=> handleAccountDelete(account._id)}>Delete</button>
                </div>)}
                <div className={styles.add_account_container}>
                    <h3 className={styles.account_hdr}>Add Account</h3>
                    <div className={styles.account_details_container}> 
                        <p className={styles.account_title}>UserName:</p>
                        <input type="text" placeholder="username" className={styles.account_input} onChange={(e)=> setNewUsername(e.target.value)}/>
                    </div>
                    <div className={styles.account_details_container}>
                        <p className={styles.account_title}>Password:</p>
                        <input type="text" placeholder="password" className={styles.account_input} onChange={(e)=> setNewPassword(e.target.value)}/>
                    </div>
                    <button className={styles.btn} onClick={()=> handleAddAccount()}>Submit</button>
                </div> </>}
            </div> :null}
        </div>
    </div>
  )
}

export default Settings