import dbConnect from "../../../utils/mongodb";
import Sections from "../../../models/sections";

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
        const section = await Sections.findById(id);
        res.status(200).json(section);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    if (method === "PUT") {
      if(!token || token !== process.env.TOKEN){
        return res.status(401).json("Not authenticated!")
      }
      try {
        const sectionUpdate = await Sections.findByIdAndUpdate(id, req.body, {new:true,});
        res.status(200).json(sectionUpdate);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    if (method === "DELETE") {
        if(!token || token !== process.env.TOKEN){
            return res.status(401).json("Not authenticated!")
          }
      try {
        await Sections.findByIdAndDelete(id);
        res.status(200).json("The product has been deleted!");
      } catch (err) {
        res.status(500).json(err);
      }
    }
}