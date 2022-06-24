import { loadStripe } from "@stripe/stripe-js";

let stripeService: any;

const getStripeService = () => {
    if (!stripeService) {
        stripeService = loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
        );
    }

    return stripeService;
};

export default getStripeService;