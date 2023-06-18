import cookie from "cookie";

const handler = (req, res) => {
  let token;
  if (req.method === "POST") {
  const {adminMatch, location} = req.body;
  token = 
      location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
    : location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
    : null;
  try{
    if (
        adminMatch === true
    ) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          maxAge: 60 * 60 * 24,
          sameSite: "strict",
          path: "/",
        })
      );
      res.status(200).json(true)
    } else {
      res.status(400).json(false);
    }
  } catch (err){
    res.status(400).json(false);
  }
  }
  
  if(req.method === "DELETE"){
    const {location} = req.query;
    token = 
      location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
    : location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
    : null;
    try{
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        maxAge:0,
        sameSite:"Strict",
        path:"/",
      })
    );
    res.status(200).json("Logout Successful")}
    catch(err){
      console.log(err);
      res.status(400).json("Logout error!")
    }
  }
};

export default handler;


