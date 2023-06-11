import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const {method} = req;
    const id = req.query.id;
    try {

    if (!id.startsWith('_cs')){

        throw Error('Incorrect session ID');

    }
    const checkout = await stripe.checkout.sessions.retrieve(id);
    
    res.status(200).json(checkout);

} catch (err) {

    res.status(500).json({statusCode:500, message: err.message})
    
    }

}