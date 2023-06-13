import { loadStripe } from "@stripe/stripe-js";

export async function CheckOut(details){

	try {
		const {session} = await fetch('/api/checkout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(details)
		}).then(res => res.json())
		console.log(session);
		let stripePromise = null
	
		const getStripe = () => {
			if(!stripePromise) {
				stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
			};
			return stripePromise;
		};
	
		const stripe = await getStripe();
	
		
	
		const res = await stripe.redirectToCheckout({
			sessionId: session.id
		});
	} catch (error) {
		console.error(error)
	}


};
