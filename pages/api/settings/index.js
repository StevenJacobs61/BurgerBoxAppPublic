import dbConnect from "../../../utils/mongodb";
import settings from "../../../models/settings";

export default async function handler(req, res) {
    const { method, cookies, query } = req;
    
    await dbConnect()
    
    if (method === 'GET'){
      try{
        const settingsList = await settings.findOne(query); 
        res.status(200).json(settingsList);
      } catch(err){
        res.status(500).json(err)
      }
    }
    
    if (method === "PATCH") {
      const token = cookies.token;
      const envToken = query.location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
        : query.location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
        : null;
        if(!token || token !== envToken){
          return res.status(401).json("Not authenticated!")
        }
        const {filter, update} = req.body;
          try {
            await settings.updateMany(filter, update, {new:true});
            res.status(200).json("Settings Updated."); 
          } catch (err) {
            res.status(500).json(err);
          }
        }

    // if (method === 'POST'){
        // if(!token || token !== process.env.NEXT_PUBLIC_TOKEN){
        //     return res.status(401).json("Not authenticated!")
        //   }
    //     try{
    //         const setting = await settings.create(req.body);
    //         res.status(201).json(setting);
    //     } catch (err){
    //       console.error(err);
    //         res.status(500).json(err);
    //     }
    // }

  }