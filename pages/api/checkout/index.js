import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

    if (req.method = "POST"){
try {
    const session = await stripe.checkout.sessions.create({
        mode:'payment',
        payment_method_types:['card'],
        line_items: req?.body?.items ?? [],
        success_url:`${req.headers.origin}/?success=true`,
        // Success Url may need updating or cause a bug
        cancel_url:`${req.headers.origin}/?canceled=true`,
    });
    res.redirect(303, session.url);
} catch (err) {
    console.log(err);
}

    }else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method not allowed");
    }
}