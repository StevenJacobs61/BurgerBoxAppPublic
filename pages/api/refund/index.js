import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_SECRET_KEY);

export default async function handler(req, res) {
    const {method} = req;
    let {id, amount} = req.body;
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