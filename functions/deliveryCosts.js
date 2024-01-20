export default function handleDeliveryCosts(outcode, location, total){
    let cost = 0;
    console.log(location);
    if(location === "Seaford"){
        cost = handleSeafordDeliveryCosts({outcode, total});
    }else if (location === "Eastbourne"){
        return
    }
    return cost;
}

const handleSeafordDeliveryCosts = ({outcode, total}) =>{
    let deliveryCost = 0;
      if(outcode === "bn25" && total < 13){
        deliveryCost = 3;
      }
      if(outcode === "bn9" && total < 18){
       deliveryCost = 5;
      }
      if((outcode === "bn26" || outcode == "bn10") && total < 26){
       deliveryCost = 6;
    }
    return deliveryCost;
  }