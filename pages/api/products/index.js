import dbConnect from "../../../utils/mongodb";
import products from "../../../models/products";

export default async function handler(req, res) {
const { method, cookies, query } = req;

    const token = cookies.token;
    const envToken = query.location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
        : query.location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
        : null;

    await dbConnect()

    if (method === 'GET'){
        try{
            const items = await products.find(query); 
            res.status(200).json(items);
        } catch(err){
            res.status(500).json(err)
        }
    }
    if (method === 'POST'){
        if(!token || token !== envToken){
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