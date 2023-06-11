import dbConnect from "../../../utils/mongodb";
import orders from "../../../models/orders";

export default async function handler(req, res) {
const { method, cookies, query } = req;
const token = cookies.token;

    dbConnect()

    if (method === 'GET'){
      const propCookies = req.headers.cookie
      if((!propCookies || propCookies !== process.env.TOKEN) && (!token || token !== process.env.TOKEN)){
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
      if(!token || token !== process.env.TOKEN){
        return res.status(401).json("Not authenticated!")
      }
        const {filter, update} = req.body;
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
      const {filter} = req.body;
      try{
        await orders.deleteMany(filter, {new:true});
        res.status(200).json('Orders deleted.');}
        catch (err){
          console.log(err);
        }
    }
  }