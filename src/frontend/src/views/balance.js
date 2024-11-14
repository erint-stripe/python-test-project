import { React, useState, useEffect } from "react";

function Balance() {

    const [balance, setBalance] = useState(null);
    const [balanceTransactions, setBalanceTransactions] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError();
        getBalance();
        getBalanceTransactions();
    }, []);

    async function getBalance() {
        setError();
        return fetch("/balance")
            .then(response => response.json())  
            .then(data => setBalance(data))
            .catch(err => setError(JSON.stringify(err.message)));
    }

    async function getBalanceTransactions() {
        setError();
        return fetch("/balance-transactions")
            .then(response => response.json())  
            .then(data => setBalanceTransactions(data.data))
            .catch(err => setError(JSON.stringify(err.message)));
    }

    return (
        <div style={{minWidth: "300px", maxWidth: "400px", margin: "auto"}} className="fade-in">
            <h3>balance</h3>
            { error && <div style={{color: "red"}} className="fade-in">{`error: ${error}`}</div>}
            <h4>current balance</h4>
            { balance && <pre class="code-block fade-in">{JSON.stringify(balance, null, 2)}</pre> }
            <h4>balance history</h4>
            { balanceTransactions && 
                <table className="fade-in">
                    <tr>
                        <th>Created</th>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Amount</th>
                    </tr>
                    {balanceTransactions.map((item, index) => (
                        <tr>
                            <td>{balanceTransactions[index].created}</td>
                            <td>{balanceTransactions[index].id}</td>
                            <td>{balanceTransactions[index].status}</td>
                            <td>{balanceTransactions[index].amount}</td>
                        </tr>
                    ))}
                </table>
            }
        </div>
    );
  }
  
  export default Balance;
  