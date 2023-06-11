import dbConnect from "../../../utils/mongodb";
import extras from "../../../models/extras";

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
        const extra = await extras.findById(id);
        res.status(200).json(extra);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    if (method === "PUT") {
      if(!token || token !== process.env.TOKEN){
        return res.status(401).json("Not authenticated!")
      }
      try {
        const extrasUpdate = await extras.findByIdAndUpdate(id, req.body, {new:true,});
        res.status(200).json(extrasUpdate);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    if (method === "DELETE") {
      if(!token || token !== process.env.TOKEN){
        return res.status(401).json("Not authenticated!")
      }
      try {
        await extras.findByIdAndDelete(id);
        res.status(200).json("The product has been deleted!");
      } catch (err) {
        res.status(500).json(err);
      }
    }
}