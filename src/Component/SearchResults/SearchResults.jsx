import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

export default function SearchResults() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!query) return;
      setLoading(true);
      try {
        const { data } = await axios.get(`http://stockmarcket.runasp.net/api/Stocks/${query}`);
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  return (
    <div className="container my-4">
      <h4 className="mb-4">Results for "{query}":</h4>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-muted">No matching stocks found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Price</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {results.map((stock) => (
              <tr key={stock.id}>
                <td>{stock.sName}</td>
                <td>${stock.price?.toFixed(2) ?? "N/A"}</td>
                <td>
                  <Link to={`/stock/${stock.id}`} className="btn btn-outline-primary btn-sm">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
