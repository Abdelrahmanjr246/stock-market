import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";

export default function TransactionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const stoSympol = queryParams.get("stoSympol") || "";
  const price = queryParams.get("price") || 0;

  const [formData, setFormData] = useState({
    stoSympol,
    qty: 0,
    price,
    typ: "buy",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const userName = localStorage.getItem("userName");

    if (!userName) {
      alert("🚫 You must be logged in first!");
      navigate("/login");
      return;
    }

    if (!formData.qty || isNaN(formData.qty) || parseInt(formData.qty) <= 0) {
      newErrors.qty = "🚫 Please enter a valid quantity greater than 0.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post(
        "http://stockmarcket.runasp.net/api/Transactions",
        null,
        {
          params: {
            userName,
            stoSympol: formData.stoSympol,
            qty: formData.qty,
            price: formData.price,
            typ: formData.typ.toLowerCase(),
          },
        }
      );

      setSuccess(true);

      const shareText = formData.qty === "1" || parseInt(formData.qty) === 1 ? "share" : "shares";

      setMessage(
        `✅ You have successfully ${
          formData.typ === "buy" ? "bought" : "sold"
        } ${formData.qty} ${shareText} of ${formData.stoSympol}.`
      );

      setTimeout(() => {
        navigate("/wallet");
      }, 2000);
    } catch (error) {
      console.error(
        "Error submitting transaction:",
        error.response?.data || error
      );
      setSuccess(false);
      setMessage("❌ Failed to complete the transaction. Please try again.");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5 text-color"><FontAwesomeIcon icon={faMoneyBillTransfer} className="me-2" /> Make a Transaction</h2>

      

      <form onSubmit={handleSubmit} className=" my-box-shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label className="text-color">Stock Symbol:</label>
          <input
            type="text"
            className="form-control my-2"
            name="stoSympol"
            value={formData.stoSympol}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="text-color">Price per Share ($):</label>
          <input
            type="number"
            className="form-control my-2"
            name="price"
            value={formData.price}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="text-color">Quantity:</label>
          <input
            type="number"
            className={`form-control my-2 ${errors.qty ? "is-invalid" : ""}`} 
            name="qty"
            value={formData.qty}
            onChange={handleChange}
          />
          {errors.qty && <div className="text-danger mt-1">{errors.qty}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label text-color">Transaction Type:</label>
          <select
            className="form-select my-2"
            name="typ"
            value={formData.typ}
            onChange={handleChange}
          >
            <option value="buy">buy</option>
            <option value="sell">sell</option>
          </select>
        </div>

        {message && (
        <div
          className={`${
            success ? "text-success" : "text-danger"
          } text-center fw-bold`}
        >
          {message}
        </div>
      )}

        <div className=" d-flex justify-content-center gap-3 my-3">
        
        <button
  type="submit"
  className={`btn ${formData.typ === "buy" ? "btn-success" : "btn-danger"}`}
>
  {formData.typ === "buy" ? "Buy" : "Sell"} Stock
</button>

        
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >Back
        </button>
        </div>
      </form>
    </div>
  );
}
