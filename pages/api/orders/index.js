import dbConnect from "../../../utils/mongodb";
import orders from "../../../models/orders";

export default async function handler(req, res) {
const { method, cookies, query } = req;
const token = cookies.token;
const envToken = query.location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
: query.location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
: null;

   await dbConnect()

    if (method === 'GET'){
      const propCookies = req.headers.cookie
      if((!propCookies || propCookies !== envToken) && (!token || token !== envToken)){
          return res.status(401).json("Not authenticated!")
        }
        try{
            const orderList = await orders.find(query); 
            res.status(200).json(orderList);
        } catch(err){
            res.status(500).json(err)
        }
    }
    if (method === "PATCH"){
      if(!token || token !== envToken){
        return res.status(401).json("Not authenticated!")
      }
        const {filterDelivery, filterCollection, updateDelivery, updateCollection} = req.body;
        let filter = filterDelivery ? filterDelivery : filterCollection ? filterCollection : req.body.filter;
        let update = updateDelivery ? updateDelivery : updateCollection ? updateCollection : req.body.update;
      console.log(filter + "\n" + update);

        
        try {
          await orders.updateMany(filter, update, {new:true});
          res.status(200).json("Order Status Updated."); 
        } catch (err) {
          res.status(500).json(err);
        }
      }
    if (method === 'POST'){
        try{
            const order = await orders.create(req.body);
            res.status(201).json(order);
        } catch (err){
            res.status(500).json(err);
        }
    }
    if (method === "DELETE"){
      if(!token || token !== envToken){
        return res.status(401).json("Not authenticated!")
      }
        const filter = req.body;
      try{
        await orders.deleteMany(filter, {new:true});
        res.status(200).json('Orders deleted.');}
        catch (err){
          console.log(err);
        }
    }
  }