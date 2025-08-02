import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUniversity, 
  faUserGraduate,
} from '@fortawesome/free-solid-svg-icons';
export default function Footer() {
  return <>
    <footer className="custom-bg text-white py-4 mt-5">
      <div className="container text-center">
        {/* Project Info */}

        <h5 className="text-color mb-2"><FontAwesomeIcon icon={faUniversity} className="me-2" /> Stock Market Graduation Project</h5>
        <p className="text-color mb-2">
          <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
          Developed by 6 students from the Information Systems department |&nbsp;<strong> Supervised by Dr. Ahmed Elsayed </strong>
        </p>


        <p className="mb-3">
  <strong className="text-light">Team Members:</strong>
  <span className="text-info"> Abdelrahman Mostafa, Abdallah Sherif, Ahmed Farag, Abdallah Abdelrazek, Yousef Gouma,<span className=' text-white'> and</span> Abdelazim Yousef.</span>
</p>


        {/* Disclaimer */}
        <p className=" small">
          Disclaimer: This website is created for academic purposes only. It does not offer real-time stock data or financial advice.
        </p>

        {/* Copyright */}
        <p className=" text-light small mb-0">
          &copy; 2025 Stock Market Project | Helwan University. All rights reserved.
        </p>
      </div>
    </footer>
  </>
}
