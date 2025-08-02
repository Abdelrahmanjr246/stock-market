import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faPen, faPenFancy } from "@fortawesome/free-solid-svg-icons";

const EducationalResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // للانتقال لصفحة إضافة مقال

  useEffect(() => {
    axios
      .get("http://stockmarcket.runasp.net/api/EduRecurse")
      .then((res) => {
        setResources(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching educational resources:", err);
        setLoading(false);
      });
  }, []);

  const handleShowModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-muted">جاري تحميل المقالات التعليمية...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
        <h2 className=" text-center fw-bold mb-0 text-color"><FontAwesomeIcon icon={faGraduationCap} /> Educational resources</h2>
        {/* <Button variant="success" onClick={() => navigate("/add-edu-article")}>
          ✍  Add article
        </Button> */}

      <div className="row gy-5 mt-3">
        {resources.map((item) => (
          <div key={item.id} className="col-12">
            <div className="d-flex flex-column flex-md-row shadow-sm p-3 border rounded">
              <div className="me-md-4 mb-3 mb-md-0" style={{ flex: "0 0 250px" }}>
                <img
                  src={item.imge}
                  alt={item.eduTitle}
                  className="img-fluid rounded"
                  style={{ height: "100%", objectFit: "cover" }}
                />
              </div>

              <div className="flex-grow-1 d-flex flex-column">
                <h4 className="text-color clamp-2-lines fw-bold">{item.eduTitle}</h4>
                <p className="text-muted small mb-2">
                  <FontAwesomeIcon icon={faPen} className="me-2"/>{item.nameOfUthor} •{" "}
                  {new Date(item.dateOfNew).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-muted clamp-2-lines mb-3">
                  {item.theEduRecurse.slice(0, 300)}...
                </p>
                <div className="mt-auto">
                  <Button className="btn btn-sm text-color fw-bold"style={{ backgroundColor: "#003566" }}
                    onClick={() => handleShowModal(item)}
                  >
               Read more
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for full article */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        {selectedItem && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedItem.eduTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="text-muted small mb-3">
                ✍ {selectedItem.nameOfUthor} •{" "}
                {new Date(selectedItem.dateOfNew).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <img
                src={selectedItem.imge}
                alt=""
                className="img-fluid rounded mb-4"
              />
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      style={{ color: "#0d6efd" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {props.children}
                    </a>
                  ),
                  p: ({ node, ...props }) => <p {...props} style={{ marginBottom: "0.5rem" }} />,
                  ul: ({ node, ...props }) => <ul {...props} style={{ paddingLeft: "1.25rem" }} />,
                  li: ({ node, ...props }) => <li {...props} style={{ marginBottom: "0.25rem" }} />,
                }}
              >
                {selectedItem.theEduRecurse}
              </ReactMarkdown>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                cancel
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default EducationalResources;