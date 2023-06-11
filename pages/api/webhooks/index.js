import axios from 'axios';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { io } from "socket.io-client";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookHandler = async (req, res) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      // Invalid webhook signature
      return res.status(400).end();
    }

    if (event.type === 'checkout.session.completed') {
    
      const id = event.data.object.client_reference_id;
      const data = {
        status:1
      }
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/` + id, data);
        console.log("order updated");
        console.log(id);


            const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`)
            socket.on("connect", () => {
              console.log("Socket connected");
            });
            socket.emit("newOrder", id);
         
    
      } catch (error) {
        console.error('Error updating order:', error);
      }
   

      // Return a response to acknowledge receipt of the event
      return res.json({ received: true });
    }
  }

  // Method not allowed
  res.setHeader('Allow', 'POST');
  res.status(405).end();
};

export default webhookHandler;