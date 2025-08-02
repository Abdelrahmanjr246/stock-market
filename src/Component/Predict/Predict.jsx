import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

export default function Predict() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stock, setStock] = useState(null);
  const [formData, setFormData] = useState({
    open: "", // سعر السهم المدخل
    date: new Date(), // تاريخ اليوم كقيمة ابتدائية
  });
  const [predictionResult, setPredictionResult] = useState("");
  const [error, setError] = useState("");

  // جلب بيانات السهم عند التحميل
  const fetchCurrentPrice = async () => {
    try {
      const response = await axios.get("http://stockmarcket.runasp.net/api/Stocks");
      const foundStock = response.data.find((item) => item.id === parseInt(id));

      if (foundStock) {
        setStock(foundStock);
        setFormData((prev) => ({
          ...prev,
          open: foundStock.price,
        }));
      } else {
        setError("❌ Stock not found.");
      }
    } catch (err) {
      console.error("Error loading stock price:", err);
      setError("❌ Failed to fetch stock price.");
    }
  };

  useEffect(() => {
    fetchCurrentPrice();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stock?.sName) {
      setError("❌ Stock symbol is missing. Try reloading.");
      return;
    }

    if (!formData.open) {
      setError("❌ Open price is required.");
      return;
    }

    try {
      const response = await axios.post("https://amrgamal11-stockapi.hf.space/predict", {
        open: parseFloat(formData.open),
        day: formData.date.getDate(),
        month: formData.date.getMonth() + 1,
        year: formData.date.getFullYear(),
        stock: stock.sName,
      });

      if (response.data && response.data.predicted_close) {
        const { predicted_close, message } = response.data;
        setPredictionResult(`${message}! Predicted close price: $${predicted_close.toFixed(2)}`);
        setError("");
      } else {
        setError("❌ Received invalid data from the server.");
        setPredictionResult("");
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setError("❌ Failed to get prediction. Please try again.");
      setPredictionResult("");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5 text-color"> <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '8px' }} />Stock Price Prediction</h2>

      <div className="card my-box-shadow p-4">
        {stock && (
          <h4 className="text-center mb-3">
            Predicting for: <strong>{stock.fullName} ({stock.sName})</strong>
          </h4>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-color">Current Price:</label>
            <input
              type="number"
              className="form-control my-2"
              name="open"
              value={formData.open}
              onChange={handleChange}
            />
          </div>

          <label className="text-color d-block">Date:</label>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            className="form-control my-2"
            dateFormat="yyyy/MM/dd"
          />

          <div className="d-flex justify-content-center gap-3">
            <button type="submit" className="btn btn-primary">Predict</button>
            <button type="button" className="btn btn-danger" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </form>

        {error && (
          <div className="text-white bg-danger border border-danger rounded-2 p-2 mt-3">
            {error}
          </div>
        )}

        {predictionResult && (
          <div className="text-white bg-success border border-success rounded-2 p-2 mt-3">
            {predictionResult}
          </div>
        )}
      </div>
    </div>
  );
}
