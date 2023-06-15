import dbConnect from "../../../utils/mongodb";
import admin from "../../../models/admin";

export default async function handler(req, res) {
const { method, cookies, query } = req;

const token = cookies.token;
dbConnect()

if (method === 'GET'){
    const propCookies = req.headers.cookie
    if(!propCookies || propCookies !== process.env.NEXT_PUBLIC_TOKEN){
        return res.status(401).json("Not authenticated!")
      }
    try{
        const admins = await admin.find(query); 
        res.status(200).json(admins);
    } catch(err){
        res.status(500).json(err)
    }
}
if (method === 'POST'){
    if(!token || token !== process.env.NEXT_PUBLIC_TOKEN){
        return res.status(401).json("Not authenticated!")
      }
    try{
        const newAdmin = await admin.create(req.body);
        res.status(201).json(newAdmin);
    } catch (err){
        res.status(500).json(err);
    }     
}
}
