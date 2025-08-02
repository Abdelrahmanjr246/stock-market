import React from 'react'
import {useFormik} from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
    
    export default function Login({saveUserData}) {

 let navigate=useNavigate();
 const [isloading,setisloading] = useState(false);
 const [messageError,setmessageError] = useState('');

  
 async function handleLogin(values) {
  setisloading(true);

  try {
    let { data } = await axios.post("http://stockmarcket.runasp.net/api/Account/Login", values);
    
    localStorage.setItem("userToken", data.token); // حفظ التوكن
    localStorage.setItem("userName", values.userName);
    saveUserData();  // تحديث بيانات المستخدم
    navigate("/");   // إعادة توجيه المستخدم إلى الصفحة الرئيسية
  } catch (error) {
    setmessageError("❌ Login failed. Please try again.");
  } finally {
    setisloading(false);
  }
}


 function validate(values){
  let errors={};
 


  if (!values.userName) {
    errors.userName = "User Name is Required!";
  } else if (values.userName.length < 3) {
    errors.userName = "User Name must be at least 3 letters!";
    } else if (values.userName.length > 10) {
      errors.userName = "User Name  must not exceed 10 characters!";
  }



  if (!values.password) {
    errors.password = "Password is required!";
  } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,10}$/.test(values.password)) {
    errors.password = "Password must contain at least one uppercase letter, one digit, and one special character";
  }



return errors;
  
}


 let formik=useFormik({
  initialValues:{
    
    userName:'',
    password:'',
   
  },
  validate,
  onSubmit:handleLogin
 }); 
 
    
  


  return <>
  <div class="container my-5 ">
      <div className='content w-75 m-auto p-5'>
      <h3 className='text-center text-color'>Login to Stock Market</h3>          

      <form onSubmit={formik.handleSubmit}>

        <label htmlFor='userName' className='text-color'>User Name:</label>
        <input 
          onBlur={formik.handleBlur}
          className='form-control my-3'  
          onChange={formik.handleChange}   
          value={formik.values.userName} 
          type='text' 
          name='userName' 
          id='userName'
        />
        {formik.errors.userName &&formik.touched.userName?<div className='text-danger fw-bold'>{formik.errors.userName}</div>:null}

        <label htmlFor='password' className='text-color'>Password:</label>
        <input 
          onBlur={formik.handleBlur} 
          className='form-control my-3'  
          onChange={formik.handleChange}   
          value={formik.values.password} 
          type='password' 
          name='password' 
          id='password'
        />
        {formik.errors.password &&formik.touched.password?<div className='text-danger fw-bold'>{formik.errors.password}</div>:null}
        {messageError && <div className='text-danger fw-bold text-center'>{messageError}</div>}      
      
      
      {isloading ?<button  type='button' className='btn content-btn w-100 my-3 text-white' ><i className='fas fa-spinner fa-spin'></i></button>:
      <button disabled={!(formik.isValid && formik.dirty)} type="submit"  className='btn content-btn w-100 my-3 text-white' >Login</button>}
      </form>
    </div>
  </div>   
  </>
}

