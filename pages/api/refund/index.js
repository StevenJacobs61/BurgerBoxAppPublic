import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const {method, cookies} = req;
    let {id, amount, location} = req.body;
    const token = cookies.token;
    const envToken = location === "Seaford" ? process.env.NEXT_PUBLIC_SEAFORD_TOKEN 
      : location === "Eastbourne" ? process.env.NEXT_PUBLIC_EASTBOURNE_TOKEN
      : null;
    if(!token || token !== envToken){
      return res.status(401).json("Not authenticated!")
    }

   if (method === "POST"){

  let list = [];
  let order = {};

  // get list of checkout sessions
  try {
    const checkouts = await stripe.checkout.sessions.list();
    list = checkouts.data;
  } catch (error) {
    console.log(error);
  };
  // filter list for required session to refund
   const orderMatch = list.some((item) => item.client_reference_id === id)
  // respose if not found
  if (!orderMatch) {
    return
  } else {
    // Set order
    order = list.find((item) => item.client_reference_id === id)
  }
  // order Payment of intent to use for refund
  const pi = order.payment_intent;
  // submit refund with pi
try{
  if(!amount){
  const refund = await stripe.refunds.create({
    payment_intent: pi
  })
}else {
  const refund = await stripe.refunds.create({
    payment_intent: pi,
    amount: amount
  });
}
  res.json({
    message: "Refund successful",
    success: true,
  })
}catch(err){
 console.log(err);
 res.json({
  message: "Refund unsuccessful",
  success: false
 });
};
   }
}