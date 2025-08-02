import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import abdo from "../../asssets/logo1.png";


export default function Navbar({ logout }) {
  const isLoggedIn = localStorage.getItem("userToken") !== null;

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();




  const searchRef = useRef(null);
  // Fetch suggestions when typing
  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim() === "") {
        setResults([]);
        return;
      }

      try {
        const { data } = await axios.get("http://stockmarcket.runasp.net/api/Stocks");
        const filtered = data.filter((stock) =>
          stock.sName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filtered);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Press enter or click "Search"
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm("");
      setResults([]);
    }
  };

  // Click on suggestion
  const handleSuggestionClick = (stockId) => {
    navigate(`/stock/${stockId}`);
    setSearchTerm("");
    setResults([]);
  };
  useEffect(() => {
  const handleClickOrKey = (event) => {
    // 🖱️ If clicking outside the search area
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setResults([]);
    }

    // ⌨️ If Escape key is pressed
    if (event.key === "Escape") {
      setResults([]);
    }
  };

  document.addEventListener("mousedown", handleClickOrKey);
  document.addEventListener("keydown", handleClickOrKey);

  return () => {
    document.removeEventListener("mousedown", handleClickOrKey);
    document.removeEventListener("keydown", handleClickOrKey);
  };
}, []);


  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow sticky-top position-relative custom-bg">
      <div className=" container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img width={45} height={45} src={abdo} alt="logo" style={{ borderRadius: "50%" }} />
          <span className="fw-bold fs-4 text-color">Stock Market</span>
        </Link>

        {/* ✅ Search bar only when logged in */}
        {isLoggedIn && (
          <form
            onSubmit={handleSearchSubmit}
            ref={searchRef}
            className="d-flex align-items-center position-relative"
          >
            <input
              type="search"
              className="form-control me-2"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "200px" }}
            />
            <button style={{ height: "100%"  }} className="btn btn-outline-light btn-sm" type="submit">
              Search
            </button>

            {results.length > 0 && (
              <ul className="list-group position-absolute top-100 start-0 mt-1 z-3 w-100">
                {results.map((stock) => (
                  <li
                    key={stock.id}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSuggestionClick(stock.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {stock.sName} - {stock.fullName}
                  </li>
                ))}
              </ul>
            )}
          </form>
        )}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {isLoggedIn ? (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item"><NavLink className="nav-link text-white fw-bold" to="/">Home</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link text-white fw-bold" to="Market Data">Market</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link text-white fw-bold" to="News">News</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link text-white fw-bold" to="Wallet">Wallet</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link text-white fw-bold" to="EducationalResources">Education</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link text-white fw-bold" to="TradingFeatures">Transactions</NavLink></li>
              <li className="nav-item p-1">
                <button onClick={logout} className="btn btn-danger btn-sm ms-2">Logout</button>
              </li>
            </ul>
          ) : (
            <div className="d-flex w-100 justify-content-end align-items-center gap-2">
              <Link className="btn btn-outline-light fw-bold text-color" to="/Login">Login</Link>
              <Link className="btn btn-primary fw-bold text-color" to="/Register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
