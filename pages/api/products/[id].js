import dbConnect from "../../../utils/mongodb";
import products from "../../../models/products";

export default async function handler(req, res) {
    const {
      method,
      cookies,
      query: { id, location },
    } = req;
  
    const token = cookies.token;
    const envToken = location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
        : location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
        : null;
  
    dbConnect();
  
    if (method === "GET") {
      try {
        const menuItem = await products.findById(id);
        res.status(200).json(menuItem);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    if (method === "PUT") {
      if(!token || token !== envToken){
        return res.status(401).json("Not authenticated!")
      }
      try {
        const productUpdate = await products.findByIdAndUpdate(id, req.body, {new:true,});
        res.status(200).json(productUpdate);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    if (method === "DELETE") {
      if(!token || token !== envToken){
        return res.status(401).json("Not authenticated!")
      }
      try {
        await products.findByIdAndDelete(id);
        res.status(200).json("The product has been deleted!");
      } catch (err) {
        res.status(500).json(err);
      }
    }
}