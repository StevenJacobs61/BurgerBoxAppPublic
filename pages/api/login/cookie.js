import cookie from "cookie";

const handler = (req, res) => {
  if (req.method === "POST") {
  const {adminMatch} = req.body;
  try{
    if (
        adminMatch === true
    ) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", process.env.TOKEN, {
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
    try{
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", process.env.TOKEN, {
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


