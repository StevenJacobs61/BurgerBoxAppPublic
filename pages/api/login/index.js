import dbConnect from "../../../utils/mongodb";
import admin from "../../../models/admin";

export default async function handler (req, res){
    dbConnect()

    const {username, password, location, isApp} = req.body
    if(!isApp) return
    else{
        try{
        const adminRes = await admin.findOne({username, password, location})
        if(!adminRes) {
        return res.status(400).json(false)
        }
        else {
          return res.status(200).json(true);
        }
    } catch (err){
        res.status(501).json("Error with login")
    }
    }
}