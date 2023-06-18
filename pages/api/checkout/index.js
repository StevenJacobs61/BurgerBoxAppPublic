import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const { lineItems, id, email, location, applyDiscount } = req.body;
    if (req.method === "POST"){
        const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order/${id}?location=${location}&success=true`;
		const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order/${id}?location=${location}&success=false`;
try {
    const sessionData = {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: lineItems,
        client_reference_id: id,
        customer_email: email,
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: applyDiscount,
        metadata: {
            location: location,
          },
      };
    const session = await stripe.checkout.sessions.create(sessionData);
    return res.status(201).json({session})
} catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({message: err.message})
}

    }else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method not allowed");
    }
}