import dbConnect from "../../../utils/mongodb";
import extras from "../../../models/extras";

export default async function handler(req, res) {
const { method, cookies } = req;
  
    const token = cookies.token;

    dbConnect()

    if (method === 'GET'){
        try{
            const items = await extras.find(); 
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
            const item = await extras.create(req.body);
            res.status(201).json(item);
        } catch (err){
            res.status(500).json(err);
        }     
    }
    
  }