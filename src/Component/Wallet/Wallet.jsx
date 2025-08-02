import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,    
  faDollarSign,
  faChartLine,      
  faChartPie,
  faCalculator,
  faFire,           
  faArrowLeft       
} from '@fortawesome/free-solid-svg-icons';


const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#00C49F",
  "#FFBB28",
];

export default function Wallet() {
  const [cashBalance, setCashBalance] = useState(0);
  const [ownedStocks, setOwnedStocks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWalletData() {
      const userName = localStorage.getItem("userName");

      if (!userName) {
        console.error("User is not logged in!");
        setError("🚫 You must be logged in to view your wallet.");
        return;
      }

      try {
        // Fetch stocks
        const responseStocks = await axios.get(
          `http://stockmarcket.runasp.net/UserWallet?UserName=${userName}`
        );

        const stocksData = responseStocks.data;

        if (Array.isArray(stocksData)) {
          const stocksArray = stocksData
            .filter((stock) => stock.qtyInWlt > 0) // ← تجاهل الأسهم اللي كميتها = 0
            .map((stock) => ({
              name: stock.stockSympol,
              quantity: stock.qtyInWlt,
              avgPrice: stock.price,
              totalValue: stock.qtyInWlt * stock.price,
            }));

          setOwnedStocks(stocksArray);
        } else {
          setError("❌ Unexpected stock data format.");
        }

        // Fetch cash balance
        const responseCash = await axios.get(
          `http://stockmarcket.runasp.net/cash?UserName=${userName}`
        );

        const cash = parseFloat(responseCash.data);
        setCashBalance(isNaN(cash) ? 0 : cash);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
        setError("❌ Failed to load wallet data.");
      }
    }

    fetchWalletData();
  }, []);

  const totalStocksValue = ownedStocks.reduce(
    (acc, stock) => acc + stock.totalValue,
    0
  );
  const totalPortfolioValue = cashBalance + totalStocksValue;

  const pieData = ownedStocks.map((stock) => ({
    name: stock.name,
    value: stock.totalValue,
  }));

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => navigate(-1)}
        ><FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back
        </button>
      </div>

      <h2 className="text-center text-color mb-4"><FontAwesomeIcon icon={faBriefcase} className="me-2" />My Wallet</h2>

      {error && (
        <div className="text-danger border border-danger-subtle text-center fw-bold p-2 rounded-2 mb-2">{error}</div>
      )}

      {!error && (
        <>
          <div className="text-success border border-success-subtle text-center fw-bold p-2 rounded-2 mb-2">
            <FontAwesomeIcon icon={faDollarSign} className="me-2" /> Cash Balance: ${cashBalance.toFixed(2)}
          </div>

          <h4 className=" mt-5 fw-bold"><FontAwesomeIcon icon={faChartLine} className="me-2" /> Owned Stocks:</h4>
          <div className="table-responsive my-5 my-box-shadow">
            <table className="table table-striped table-hover m-0">
              <thead>
                <tr>
                  <th className="custom-bg text-color">Stock Name</th>
                  <th className="custom-bg text-color">Quantity</th>
                  <th className="custom-bg text-color">Avg Buy Price ($)</th>
                  <th className="custom-bg text-color">Total Value ($)</th>
                  <th className="custom-bg text-color">% of Portfolio</th>
                </tr>
              </thead>
              <tbody>
                {ownedStocks.length > 0 ? (
                  ownedStocks.map((stock, index) => (
                    <tr key={index}>
                      <td className=" text-color">{stock.name}</td>
                      <td className=" text-color">{stock.quantity}</td>
                      <td className=" text-color">{stock.avgPrice.toFixed(2)}</td>
                      <td className=" text-color">{stock.totalValue.toFixed(2)}</td>
                      <td className=" text-color">
                        {(
                          (stock.totalValue / totalPortfolioValue) *
                          100
                        ).toFixed(2)}
                        %
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-color">
                      You don’t own any stocks currently.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {ownedStocks.length > 0 && (
            <div className="my-5">
              <h4 className="text-center text-danger-emphasis"><FontAwesomeIcon icon={faChartPie} className="me-2" /> Portfolio Distribution</h4>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="text-primary mt-4 text-center fw-bold">
            <FontAwesomeIcon icon={faCalculator} className="me-2" /> Total Stocks Value: ${totalStocksValue.toFixed(2)}
          </div>

          <div className="text-info text-center fw-bold">
            <FontAwesomeIcon icon={faFire} className="me-2" /> Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
}
