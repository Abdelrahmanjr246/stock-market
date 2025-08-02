import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userName = localStorage.getItem("userName"); // الحصول على اسم المستخدم من التخزين المحلي

    if (!userName) {
      setMessage("🚫 You must be logged in to view transaction history.");
      return;
    }

    async function fetchTransactions() {
      try {
        // API الجديد مع البراميتر كـ query string
        const response = await axios.get(
          `http://stockmarcket.runasp.net/transaction/userHistory?UserName=${userName}`
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setMessage("❌ Failed to load transaction history.");
      }
    }

    fetchTransactions();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-color"><FontAwesomeIcon icon={faHistory} style={{ marginRight: '8px' }} />Transaction History</h2>

      {message && (
        <div className={`text-danger text-center fw-bold`}>
          {message}
        </div>
      )}

      <div className="table-responsive my-5 p-3">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th className="custom-bg text-color">Stock Symbol</th>
              <th className="custom-bg text-color">Quantity</th>
              <th className="custom-bg text-color">Price ($)</th>
              <th className="custom-bg text-color">Type</th>
              <th className="custom-bg text-color">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="text-color">{transaction.stockSympol}</td>
                  <td className="text-color">{transaction.qty}</td>
                  <td className="text-color">{transaction.price.toFixed(2)}</td>
                  <td className="text-color">{transaction.typ === "buy" ? "Buy" : "Sell"}</td>
                  <td className="text-color">{new Date(transaction.date).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-color">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
