const getNotifications = () => {
    let notifications;
    const localData = localStorage.getItem("Notifications");
    if(localData === null || localData === undefined){
        localStorage.setItem("Notifications", true)
        notifications = true;
    }else{
        notifications = localData;
    }
    return notifications
}
export default getNotifications