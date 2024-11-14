import { React, useState } from 'react';
import './App.css';
import PurchaseForm from './views/purchaseForm';
import PaymentIntents from './views/paymentIntents.js';
import HelloThere from './views/helloThere.js';
import Balance from './views/balance.js';

function App() {

  const [currentView, setCurrentView] = useState("PurchaseForm");

  // look at window to determine URL and choose appropriate route, localhost vs the proxy URL

  function handleNavClick(event) {
    setCurrentView(event.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>money plz</h3>
      </header>
      <body className="App-body">
        <div className="App-navbar">
          <h3>Nav</h3>
          <button onClick={handleNavClick} className="navbar-item" value="PurchaseForm">Test Payment</button>
          <button onClick={handleNavClick} className="navbar-item" value="PaymentIntents">View Payments</button>
          <button onClick={handleNavClick} className="navbar-item" value="HelloThere">A secret third thing</button>
          <button onClick={handleNavClick} className="navbar-item" value="Balance">Balance</button>
        </div>
        <div className="App-contents">
          {currentView === "PurchaseForm" && <PurchaseForm></PurchaseForm> }
          {currentView === "PaymentIntents" && <PaymentIntents></PaymentIntents> }
          {currentView === "Balance" && <Balance></Balance> }
          {currentView === "HelloThere" && <HelloThere></HelloThere> }
        </div>
      </body>
    </div>
  );
}

export default App;
