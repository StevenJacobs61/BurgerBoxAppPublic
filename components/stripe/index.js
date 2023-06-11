import { loadStripe } from "@stripe/stripe-js";

export async function CheckOut({lineItems}, id, email, location){
	let stripePromise = null

	const getStripe = () => {
		if(!stripePromise) {
			stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
		};
		return stripePromise;
	};

	const stripe = await getStripe();

	const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order/${id}?location=${location}&success=true`;
  	const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order/${id}?location=${location}&success=false`;

	const res = await stripe.redirectToCheckout({
		clientReferenceId: id,
		customerEmail:email,
		mode: 'payment',
		lineItems,
		successUrl,
		cancelUrl
	});
};
