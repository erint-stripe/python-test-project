import { React, useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';


function Checkout(donationAmount) {

    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState(null);
    console.log(donationAmount)

    async function handleCheckout(event) {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            return;
        }

        const {error} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'https://erint-app.tunnel.stripe.me',
            },
        });
    }
    
    return (
        <div className="Checkout fade-in">
            <form onSubmit={handleCheckout}>
                <PaymentElement />
                <button style={{width: "100%"}} disabled={!stripe}>{`Complete $${donationAmount.donationAmount} Payment`}</button>
            </form>
        </div>
    );
}

export default Checkout;
