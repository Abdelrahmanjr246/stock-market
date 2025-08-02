import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function DetailsNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsDetail, setNewsDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetailsNews() {
      try {
        const { data } = await axios.get(`http://stockmarcket.runasp.net/api/News/${id}`);
        setNewsDetail(data);
      } catch (error) {
        setError("فشل تحميل تفاصيل الخبر. حاول مرة أخرى.");
      }
    }

    fetchDetailsNews();
  }, [id]);

  if (error) {
    return <div className="text-danger mt-4">{error}</div>;
  }

  if (!newsDetail) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
    <div style={{marginTop :"150px"}} className="d-flex justify-content-end fixed-top">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        ><FontAwesomeIcon icon={faArrowLeft}/></button>
      </div>
      <div className="container my-5">
      
      {/* News Detail Card */}
      <div className="card shadow-lg p-4">
        <div className="card-body row">
          <div className="col-sm-3 mb-3 mb-sm-0">
            <img
              src={newsDetail.imge}
              className="rounded-3 w-100 h-100 object-fit-cover"
              alt="news-thumbnail"
            />
          </div>

          <div className="col-sm-9">
            <h2 className="text-color mb-3">{newsDetail.newTag}</h2>

            <div className="mb-3">
              <span
                className="badge me-2"
                style={{ backgroundColor:  "#003566", color: "#fff" }}
              >
                {newsDetail.nSite}
              </span>
              <small className="text-muted">
                {new Date(newsDetail.dateOfNew).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>

            <p className="card-text" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
              {newsDetail.theNew}
            </p>
          </div>
        </div>
      </div>

      {/* Back Button */}
    </div>

    </>
  );
}
