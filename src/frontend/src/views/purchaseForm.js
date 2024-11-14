import { React, useState } from "react";
import Checkout from "./checkout";

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QHZdoLFIO5qXQOWpeAEe77TsTcJp8Xd1vbkPxUYqFUZiY0MA8Kz2zQ9sLUQWzoRz4IfIiZtg6aN1GlCMaObgi3P00AZDCFj3U');

function PurchaseForm() {

    const [clientSecret, setClientSecret] = useState(null);
    const [error, setError] = useState(null);
    const [donationAmount, setDonationAmount] = useState(null);
    const [paymentIntent, setPaymentIntent] = useState(null);
    const [purchaseIntentAmount, setPurchaseIntentAmount] = useState(null);
    const [metadataRowCount, setMetadataRowCount] = useState([]);

    const stripeOptions = {
        clientSecret: clientSecret,
        appearance: {
            variables: {
                fontFamily: "Courier New",
                colorPrimary: "#000000",
                fontWeightLight: "400",
                fontWeightNormal: "700",
                fontWeightBold: "1000"
            }
        },
    };

    function updateDonationAmount(event) {
        setDonationAmount(event.target.value);
    }

    function handlePaymentIntent(data) {
        setClientSecret(data.clientSecret);
        setPaymentIntent(data.id);
        setPurchaseIntentAmount(donationAmount);
    }

    function addMetadataRow() {
        const newRows = metadataRowCount.push([])
        setMetadataRowCount(newRows);
    }
    
    async function createPaymentIntent(event) {
        setError();
        event.preventDefault();
        return fetch("/payment-intent", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({amount: donationAmount})
        })
            .then(response => response.json())  
            .then(data => handlePaymentIntent(data))
            .catch(err => setError(JSON.stringify(err.message)));
    }

    return (
        <div style={{minWidth: "300px", maxWidth: "400px", margin: "auto"}} className="PurchaseForm fade-in">
            <h3>enter donation amount</h3>
            <form style={{marginBottom: "10px"}} onSubmit={createPaymentIntent}>
                <input type="number" max="1000" min="1" step="0.01" placeholder="Donation amount ($)" style={{width: "68.5%"}} onChange={updateDonationAmount}></input>
                <input type="submit" style={{width: "28.5%"}}></input>
            </form>
            { clientSecret &&
                <button className="fade-in" onClick={addMetadataRow}>add metadata</button>
            }
            { clientSecret && 
                <Elements stripe={stripePromise} options={stripeOptions}>
                    <Checkout donationAmount={purchaseIntentAmount}></Checkout> 
                </Elements>
            }
            { error && 
                <div style={{color: "red"}}>{`error: ${error}`}</div>
            }
        </div>
    );
  }
  
  export default PurchaseForm;
  