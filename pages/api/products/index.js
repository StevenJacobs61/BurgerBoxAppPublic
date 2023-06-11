import dbConnect from "../../../utils/mongodb";
import products from "../../../models/products";

export default async function handler(req, res) {
const { method, cookies, query } = req;

    const token = cookies.token;
    dbConnect()

    if (method === 'GET'){
        try{
            const items = await products.find(query); 
            res.status(200).json(items);
        } catch(err){
            res.status(500).json(err)
        }
    }
    if (method === 'POST'){
        if(!token || token !== process.env.TOKEN){
            return res.status(401).json("Not authenticated!")
          }
        try{
            const item = await products.create(req.body);
            res.status(201).json(item);
        } catch (err){
            res.status(500).json(err);
        }
        
    }

  }