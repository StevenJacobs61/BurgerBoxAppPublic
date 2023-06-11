import dbConnect from "../../../utils/mongodb";
import admin from "../../../models/admin";

export default async function handler(req, res) {
    const {
      method, 
      cookies,
      query: { id },
    } = req;
  
   const token = cookies.token;

    dbConnect();
  
    if (method === "GET") {
      if(!token || token !== process.env.TOKEN){
        return res.status(401).json("Not authenticated!")
      }
      try {
        const adminId= await admin.findById(id);
        res.status(200).json(adminId);
      } catch (err) {
        res.status(500).json(err);
      }
    }
   if (method === "DELETE") {
    if(!token || token !== process.env.TOKEN){
      return res.status(401).json("Not authenticated!")
    }
      try {
        await admin.findByIdAndDelete(id);
        res.status(200).json("Admin has been deleted!");
      } catch (err) {
        res.status(500).json(err);
      }
    }
}