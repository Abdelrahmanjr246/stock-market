
import './App.css';
import {createBrowserRouter, RouterProvider  } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Home from'./Component/Home/Home';
import Navbar from'./Component/Navbar/Navbar';
import Stocks from'./Component/Stocks/Stocks';
import Layout from './Component/Layout/Layout';
import Footer from './Component/Footer/Footer';
import Notfound from './Component/Notfound/Notfound';
import News from './Component/News/News';
import Register from './Component/Register/Resgister';
import Login from './Component/Login/Login';
import Market from './Component/Market Data/Market Data';
import TradingFeatures from './Component/Trading Features/Trading Features';
import StockDetails from './Component/StockDetails/StockDetails';
import SidebarNews from './Component/SidebarNews/SidebarNews';
import Predict from './Component/Predict/Predict';
import Wallet from './Component/Wallet/Wallet';
import DetailsNews from './Component/DetailsNews/DetailsNews';
import StockTicker from './Component/StockTicker/StockTicker';
import { useEffect } from 'react';
import { useState } from 'react';
import {jwtDecode} from 'jwt-decode'
import ProtectedRoute from './Component/ProtectedRoute/ProtectedRoute';
import TransactionPage from './Component/Transaction/Transaction';
import SearchResults from './Component/SearchResults/SearchResults';
import EducationalResources from './Component/EducationalResources/EducationalResources';



function App() {

    const [userData,setuserData] = useState(null);

  function saveUserData() {
    let encodedToken = localStorage.getItem("userToken");
    if (encodedToken) {
      let decodedToken = jwtDecode(encodedToken);
      setuserData(decodedToken);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("userToken") !== null) {
      saveUserData();
    }
  }, []);
  


let routers=     createBrowserRouter([
  {path:'',element:<Layout     setuserData={setuserData}  userData={userData}/>,children:[
    {index:true,element:<ProtectedRoute><Home/></ProtectedRoute>},
    {path:'Navbar',element:<ProtectedRoute><Navbar/></ProtectedRoute>},
    {path:'Footer',element:<ProtectedRoute><Footer/></ProtectedRoute>},
    { path: "/Login", element: <Login saveUserData={saveUserData} /> },
    { path: "/Register", element: <Register /> },
    {path:'News',element:<ProtectedRoute><News/></ProtectedRoute>},
    {path:'Wallet',element:<ProtectedRoute><Wallet/></ProtectedRoute>},
    
    {path:'SidebarNews',element:<ProtectedRoute><SidebarNews/></ProtectedRoute>},
    {path:'/search',element:<ProtectedRoute><SearchResults/></ProtectedRoute>},
    {path:'StockTicker',element:<ProtectedRoute>< StockTicker /></ProtectedRoute>},
{path:'/News/:id',element:<ProtectedRoute><DetailsNews /></ProtectedRoute>},




    {path:'EducationalResources',element:<ProtectedRoute><EducationalResources/></ProtectedRoute>},

    {path:'Market Data',element:<ProtectedRoute><Market Data/></ProtectedRoute>},
    {path:'TradingFeatures',element:<ProtectedRoute><TradingFeatures/></ProtectedRoute>},
    { path: '/predict/:id', element: <ProtectedRoute><Predict /></ProtectedRoute> },
    { path: '/Transaction', element: <ProtectedRoute><TransactionPage /></ProtectedRoute> },


   {path:'/stock/:id' ,element:<ProtectedRoute><StockDetails /></ProtectedRoute>},
   {path:'/' ,element:<ProtectedRoute><Stocks /></ProtectedRoute>},
    {path:'*',element:<Notfound/>},

  ]}
]

)



  return <RouterProvider router={routers}></RouterProvider>
  
 
}

export default App;
