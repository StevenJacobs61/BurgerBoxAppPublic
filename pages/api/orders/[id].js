import dbConnect from "../../../utils/mongodb";
import orders from "../../../models/orders";

export default async function handler(req, res) {
    const {
      method,
      cookies,
      query: { id, location, webhookToken }
    } = req;
    const token = webhookToken || cookies.token;
    const envToken = location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
    : location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
    : null;
    await dbConnect();
  
    if (method === "GET") {
      try {
        const orderGet = await orders.findById(id);
        res.status(200).json(orderGet);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    if (method === "PUT") {
      if(!token || token !== envToken){
        return res.status(401).json("Not authenticated!")
      }
      try {
        const orderUpdate = await orders.findByIdAndUpdate(id, req.body, {new:true,});
        res.status(200).json(orderUpdate);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    if (method === "DELETE") {
      if(!token || token !== envToken){
        return res.status(401).json("Not authenticated!")
      }
      try {
        await orders.findByIdAndDelete(id);
        res.status(200).json("The order has been deleted!"); 
      } catch (err) {
        res.status(500).json(err);
      }
    }
}