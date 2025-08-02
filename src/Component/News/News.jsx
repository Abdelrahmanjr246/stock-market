import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

export default function News({ isHomePage = false }) {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        setIsLoading(true);
        const { data } = await axios.get("http://stockmarcket.runasp.net/api/News");
        if (Array.isArray(data)) {
          const sortedData = data.sort(
            (a, b) => new Date(b.dateOfNew) - new Date(a.dateOfNew)
          );
          setNews(sortedData);
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to load news. Please try again later.");
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <div className={`container ${isHomePage ? "" : "my-5"}`}>
      {!isHomePage && (
        <>
          <Helmet>
            <title>News</title>
          </Helmet>
          <h2 className="text-center text-color mb-4" style={{ fontWeight: "700", fontSize: "1.8rem" }}>
            <FontAwesomeIcon icon={faNewspaper} className="me-2" />
            Market News
          </h2>
        </>
      )}

      {error && <div className="text-danger">{error}</div>}

      {isLoading ? (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center mt-4">
          <p>No news available.</p>
        </div>
      ) : (
        <>
          {isHomePage ? (
            <div className="news-scroll-container my-5">
              <div className="row">
                {news.slice(0, 3).map((item) => (
                  <div className="mb-4 col-sm-12" key={item.id}>
                    <div className="border rounded shadow-sm h-100 p-3 row">
                      <div className="col-12 col-md-4 mb-3 mb-md-0">
                        <img
                          src={item.imge}
                          className="rounded-3 w-100 object-fit-cover"
                          style={{ height: "200px" }}
                          alt="news-thumbnail"
                        />
                      </div>
                      <div className="col-md-8 d-flex flex-column justify-content-between">
                        
                        <div className="fw-bold mb-2 text-color" style={{ fontSize: "1.1rem" }}>
                          {item.newTag.length > 60 ? item.newTag.slice(0, 60) + "..." : item.newTag}
                        </div>
                        <span className="badge mb-2 w-50" style={{background:"#003566"}}>{item.nSite}</span>
                        <div className="small text-muted mb-1">
                          {new Date(item.dateOfNew).toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <Link to={`/News/${item.id}`} className="text-primary text-decoration-none small">
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="row">
              {news.map((item) => (
                <div className="mb-4 col-sm-12" key={item.id}>
                  <div className="border rounded shadow-sm h-100 p-3 row">
                    <div className="col-12 col-md-4 mb-3 mb-md-0">
                      <img
                        src={item.imge}
                        className="rounded-3 w-100 object-fit-cover"
                        style={{ height: "100%" }}
                        alt="news-thumbnail"
                      />
                    </div>
                    <div className="col-md-8 d-flex flex-column justify-content-between">
                      <div className="fw-bold mb-2 text-color" style={{ fontSize: "1.1rem" }}>
                        {item.newTag.length > 100 ? item.newTag.slice(0, 100) + "..." : item.newTag}
                      </div>
                      <span className="badge mb-2 w-25" style={{background:"#003566"}}>{item.nSite}</span>
                      <div className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                        {item.theNew.length > 200 ? item.theNew.slice(0, 200) + "..." : item.theNew}
                      </div>
                      <div className="small text-muted mb-1">
                        {new Date(item.dateOfNew).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <Link to={`/News/${item.id}`} className="text-primary text-decoration-none small">
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isHomePage && (
        <div className="text-end mt-3">
          <Link to="/News" className="btn btn-sm text-color fw-bold"style={{ backgroundColor: "#003566" }}>
            View All News →
          </Link>
        </div>
      )}
    </div>
  );
}
