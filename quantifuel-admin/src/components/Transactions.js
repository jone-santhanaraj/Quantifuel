import React, { useState, useEffect } from 'react';
import './Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch transactions data from the server
    fetch('/api/transactions')
      .then((response) => response.json())
      .then((data) => setTransactions(data))
      .catch((error) => console.error('Error fetching transactions:', error));
  }, []);

  return (
    <div>
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Customer</th>
            <th>Fuel Amount</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.customer}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;
