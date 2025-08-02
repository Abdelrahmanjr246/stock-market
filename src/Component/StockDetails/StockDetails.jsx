import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StockDetails() {
  const { id } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStockDetails() {
      try {
        let { data } = await axios.get("http://stockmarcket.runasp.net/api/Stocks");
        const foundStock = data.find((item) => item.id === parseInt(id));
        if (foundStock) {
          setStock(foundStock);
        } else {
          setError("Stock not found!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock details:", error);
        setError("Error fetching data!");
        setLoading(false);
      }
    }
    fetchStockDetails();
  }, [id]);

  if (loading) return <p className="text-center my-5">Loading...</p>;
  if (error) return <p className="text-center text-danger my-5">{error}</p>;

  return (
    <div className="container my-5">
      <div className="card my-box-shadow p-4 text-center">
        <img
          width={100} height={100}style={{ borderRadius: "50%" }} 
          src={stock.imge}
          alt={stock.sName}
          className="img-fluid mb-3 m-auto"
        />
        <h2 className="fw-bold text-color">{stock.fullName} ({stock.sName})</h2>
        <h4 className="fw-bold my-2">${stock.price.toFixed(2)}</h4>
        <p className="text-muted">{stock.prefinfo}</p>
        <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
          {/* زرار الرجوع */}
          <Link to="/" className="btn btn-danger">
            Back to Stocks
          </Link>

          {/* زرار Predict */}
          <Link to={`/predict/${stock.id}`} className="btn btn-primary">
            Predict
          </Link>

          <Link
  to={`/transaction?stoSympol=${stock.sName}&price=${stock.price}`}
  className="btn btn-success"
>
  Buy / Sell
</Link>


        </div>
      </div>
    </div>
  );
}
