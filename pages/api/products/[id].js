import dbConnect from "../../../utils/mongodb";
import products from "../../../models/products";

export default async function handler(req, res) {
    const {
      method,
      cookies,
      query: { id },
    } = req;
  
    const token = cookies.token;
  
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
      if(!token || token !== process.env.TOKEN){
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
      if(!token || token !== process.env.TOKEN){
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