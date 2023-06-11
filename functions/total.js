export const getTotal = () => {
    let total = 0;
    const localData = JSON.parse(localStorage.getItem("Orders"));
    if(!localData.length){
        total = 0;
    }else{
        localData.map((order) => total += order.price * order.quantity)
        
    }
    return total
}
export const getOrders = () => {
    if(!localStorage.getItem("Orders")){
        localStorage.setItem("Orders", "[]");
    }
    const localOrders = JSON.parse(localStorage.getItem("Orders"));
    return localOrders
}