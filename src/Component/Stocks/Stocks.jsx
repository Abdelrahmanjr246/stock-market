import React, { useState, useEffect } from "react";
import axios from "axios";
import { startSignalRConnection } from "../../services/signalRService";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
export default function Stocks() {
  const [allStocks, setAllStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // حساب عدد الصفحات
  const totalPages = Math.ceil(allStocks.length / itemsPerPage);

  // الأسهم المعروضة في الصفحة الحالية
  const currentStocks = allStocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get("http://stockmarcket.runasp.net/api/Stocks/${page}");
      const stocksWithTrend = response.data.map((stock) => ({
        ...stock,
        trend: "neutral",
      }));
      setAllStocks(stocksWithTrend);
    } catch (error) {
      console.error("❌ Error fetching stocks:", error);
    }
  };

  useEffect(() => {
    startSignalRConnection((updatedStocksArray) => {
      setAllStocks((prevStocks) => {
        const updatedList = [...prevStocks];

        updatedStocksArray.forEach((updatedStock) => {
          const index = updatedList.findIndex((s) => s.id === updatedStock.id);
          if (index !== -1) {
            const oldStock = updatedList[index];
            updatedStock.trend =
              updatedStock.price > oldStock.price
                ? "up"
                : updatedStock.price < oldStock.price
                ? "down"
                : oldStock.trend || "neutral";
            updatedList[index] = updatedStock;
          } else {
            updatedStock.trend = "neutral";
            updatedList.push(updatedStock);
          }
        });

        return updatedList;
      });
    });
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container my-5">
      <Helmet>
        <title>Stock Dashboard</title>
      </Helmet>


      <div className="row g-4">
        {currentStocks.map((stock) => (
          <div className="col-md-4" key={stock.id}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-3">
  <div className="mb-3">
    <img
      src={stock.imge}
      alt={stock.sName}
      className="rounded-circle"
      style={{
        width: "80px",
        height: "80px",
        objectFit: "cover",
        backgroundColor: "#fff",
        padding: "5px"
      }}
    />
  </div>

  <h5 className="card-title fw-bold">
    <Link to={`/stock/${stock.id}`} className="text-decoration-none text-color" >
      {stock.sName}
    </Link>
  </h5>

  <p className="text-muted mb-2">{stock.fullName}</p>

  <p className="mb-3 fs-5 d-flex justify-content-center align-items-center gap-2">
    {stock.trend === "up" && <FontAwesomeIcon icon={faArrowUp} className="text-success fpl-arrow" />}
{stock.trend === "down" && <FontAwesomeIcon icon={faArrowDown} className="text-danger fpl-arrow" />}

<strong className={stock.trend === "up" ? "text-success" : stock.trend === "down" ? "text-danger" : ""}>
  ${stock.price?.toFixed(2) || "N/A"}
</strong>
  </p>

  <Link to={`/stock/${stock.id}`} className="btn btn-sm text-color fw-bold"style={{ backgroundColor: "#003566" }}>
    View
  </Link>
</div>


            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <nav className="mt-4 d-flex justify-content-center">
  <ul className="pagination">

    {/* First Page */}
    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => handlePageChange(1)}>«</button>
    </li>

    {/* Previous Page */}
    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>‹</button>
    </li>

    {/* Dynamic Page Numbers */}
    {Array.from({ length: 3 }, (_, i) => {
      let startPage = currentPage === 1
        ? 1
        : currentPage === totalPages
        ? totalPages - 2
        : currentPage - 1;

      // Ensure startPage stays in valid range
      startPage = Math.max(1, Math.min(startPage, totalPages - 2));

      const pageNumber = startPage + i;

      // Skip invalid pages
      if (pageNumber > totalPages) return null;

      return (
        <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
            {pageNumber}
          </button>
        </li>
      );
    })}

    {/* Next Page */}
    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>›</button>
    </li>

    {/* Last Page */}
    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => handlePageChange(totalPages)}>»</button>
    </li>

  </ul>
</nav>

    </div>
  );
}
