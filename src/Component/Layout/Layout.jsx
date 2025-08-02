import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet, useNavigate } from 'react-router-dom'


export default function Layout({userData,setuserData}) {

let navigate=useNavigate();

function logout(){
  localStorage.removeItem('userToken');
  setuserData(null);
  navigate('/Login');
}



  return <>
  <Navbar logout={ logout } />
  <Outlet></Outlet>
  
  
 
  <Footer/>
  
  </>
}
