import dbConnect from "../../../utils/mongodb";
import sections from "../../../models/sections";

export default async function handler(req, res) {
    const { method, cookies, query } = req;
    const token = cookies.token;
    const envToken = query.location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
        : query.location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
        : null;

    await dbConnect()

    if (method === 'GET'){
        try{
            const sectionsList = await sections.find(query); 
            res.status(200).json(sectionsList);
        } catch(err){
            res.status(500).json(err)
        }
    }
    if (method === "PATCH") {
        if(!token || token !== envToken){
          return res.status(401).json("Not authenticated!")
        }
        const {filter, update} = req.body;
          try {
            await sections.updateMany(filter, update, {new:true});
            res.status(200).json("Sections Updated."); 
          } catch (err) {
            res.status(500).json(err);
          }
        }
    if (method === 'POST'){
        if(!token || token !== envToken){
            return res.status(401).json("Not authenticated!")
          }
        try{
            const section = await sections.create(req.body);
            res.status(201).json(section);
        } catch (err){
            res.status(500).json(err);
        }
        
    }

  }
  