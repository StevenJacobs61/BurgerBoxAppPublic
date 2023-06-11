import dbConnect from "../../../utils/mongodb";
import orders from "../../../models/orders";

export default async function handler(req, res) {
    const {
      method,
      cookies,
      query: { id }
    } = req;
  
  const token = cookies.token;

    dbConnect();
  
    if (method === "GET") {
      try {
        const orderGet = await orders.findById(id);
        res.status(200).json(orderGet);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    if (method === "PUT") {
      
      try {
        const orderUpdate = await orders.findByIdAndUpdate(id, req.body, {new:true,});
        res.status(200).json(orderUpdate);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    if (method === "DELETE") {
      try {
        await orders.findByIdAndDelete(id);
        res.status(200).json("The order has been deleted!"); 
      } catch (err) {
        res.status(500).json(err);
      }
    }
}