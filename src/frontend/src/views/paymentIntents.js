import { React, useEffect, useState } from "react";

function PaymentIntents() {

    const [transactions, setTransactions] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        getTransactions();
    }, []);

    async function getTransactions() {
        setError();
        return fetch("/payment-intents")
            .then(response => response.json())  
            .then(data => setTransactions(data.data))
            .catch(err => setError(JSON.stringify(err.message)));
    }

    async function handleRefund(event) {
        setError();
        setSuccess(null);
        console.log(event.target.value)
        return fetch("/refund", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: event.target.value
        })
            .then(response => response.json())
            .then(setSuccess(true))  
            .catch(err => handleError(err));
    }

    function handleError(err) {
        setSuccess(null);
        setError(JSON.stringify(err.message))   
    }

    return (
        <div style={{minWidth: "300px", maxWidth: "80%", margin: "auto"}} className="fade-in">
            <h3>payment intents</h3>
            {error && <div style={{color: "red"}} className="fade-in">{`error: ${error}`}</div>}
            {success && <div style={{color: "green"}} className="fade-in">success!</div>}
            {transactions && 
                <table className="fade-in">
                    <tr>
                        <th>Created</th>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Refund</th>
                    </tr>
                    {transactions.map((item, index) => (
                        <tr>
                            <td>{transactions[index].created}</td>
                            <td>{transactions[index].id}</td>
                            <td>{transactions[index].status}</td>
                            <td>{transactions[index].amount}</td>
                            <td>
                                <button value={JSON.stringify({paymentIntent: transactions[index].id})} onClick={handleRefund} disabled={transactions[index].status != "succeeded"}>full</button>
                                <button value={JSON.stringify({paymentIntent: transactions[index].id, amount: 100})} onClick={handleRefund} disabled={transactions[index].status != "succeeded"}>partial</button>
                            </td>
                        </tr>
                    ))}
                </table>
            }
            { /*transactions && <pre class="code-block">{JSON.stringify(transactions, null, 2)}</pre> */ }
        </div>
    );
  }
  
  export default PaymentIntents;
  