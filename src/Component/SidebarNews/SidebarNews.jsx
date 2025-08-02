import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SidebarNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data } = await axios.get("http://stockmarcket.runasp.net/api/News");
        setNews(data.slice(0, 5)); // عرض أول 5 أخبار فقط في السايدبار
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="bg-white shadow-sm p-3 rounded">
      <h5 className="text-primary mb-3">📰 Latest News</h5>
      {news.length > 0 ? (
        news.map((item) => (
          <div key={item.id} className="mb-3 border-bottom pb-2">
            <h6 className="text-dark fw-bold" style={{ fontSize: "0.95rem" }}>
              {item.newTag.length > 60 ? item.newTag.slice(0, 60) + "..." : item.newTag}
            </h6>
            <small className="text-muted d-block">{item.nSite} | {new Date(item.dateOfNew).toLocaleDateString()}</small>
          </div>
        ))
      ) : (
        <p className="text-muted">No news available</p>
      )}

      <div className="text-end">
        <a href="/News" className="btn btn-sm btn-outline-primary">View All</a>
      </div>
    </div>
  );
}
