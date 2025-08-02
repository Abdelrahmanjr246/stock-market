import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  let navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [messageError, setmessageError] = useState("");

  async function handleRegister(values) {
    setisloading(true); // تشغيل التحميل أثناء الطلب

    try {
      let { data } = await axios.post(
        "http://stockmarcket.runasp.net/api/Account/Register",  
        values
      );

      console.log("✅ Registered successfully:", data);
      setisloading(false); // إيقاف التحميل بعد نجاح الطلب
      navigate("/login"); // الانتقال إلى صفحة تسجيل الدخول بعد النجاح
    } catch (error) {
      setisloading(false); // إيقاف التحميل بعد الفشل
      if (error.response) {
        setmessageError(error.response.data.password?.[0] || "Registration failed!"); 
      } else {
        setmessageError("❌ Network error. Please try again.");
      }
    }
  }

  function validate(values) {
    let errors = {};
    if (!values.userName) {
      errors.userName = "User Name is Required!";
    } else if (values.userName.length < 3) {
      errors.userName = "User Name must be at least 3 letters!";
    } else if (values.userName.length > 10) {
      errors.userName = "User Name  must not exceed 10 characters!";
    }

    if (!values.email) {
      errors.email = "Email is Required!";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid Email address!";
    }

    if (!values.password) {
      errors.password = "Password is required!";
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,10}$/.test(values.password)) {
      errors.password = "Password must contain at least one uppercase letter, one digit and one special character";
    }

    return errors;
  }

  let formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
      email: "",
    },
    validate,
    onSubmit: handleRegister,
  });

  return (
    <div class="container my-5 ">
      <div className="content w-75 m-auto p-5">
        <h3 className='text-center text-color'>Register to Stock Market Now</h3>
        {messageError.length > 0 && <div className="text-danger">{messageError}</div>}

        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="userName" className='text-color'>User Name:</label>
          <input
            onBlur={formik.handleBlur}
            className="form-control mt-3"
            onChange={formik.handleChange}
            value={formik.values.userName}
            type="text"
            name="userName"
            id="userName"
          />
          {formik.errors.userName && formik.touched.userName && (
            <div className="text-danger fw-bold">{formik.errors.userName}</div>
          )}

          <label htmlFor="email" className='text-color'>Email:</label>
          <input
            onBlur={formik.handleBlur}
            className="form-control mt-2"
            onChange={formik.handleChange}
            value={formik.values.email}
            type="text"
            name="email"
            id="email"
          />
          {formik.errors.email && formik.touched.email && (
            <div className="text-danger fw-bold">{formik.errors.email}</div>
          )}

          <label htmlFor="password" className='text-color'>Password:</label>
          <input
            onBlur={formik.handleBlur}
            className="form-control mt-2"
            onChange={formik.handleChange}
            value={formik.values.password}
            type="password"
            name="password"
            id="password"
          />
          {formik.errors.password && formik.touched.password && (
            <div className="text-danger fw-bold">{formik.errors.password}</div>
          )}

          {isloading ? (
            <button type="button" className='btn content-btn w-100 my-3 text-white'>
              <i className="fas fa-spinner fa-spin"></i>
            </button>
          ) : (
            <button disabled={!(formik.isValid && formik.dirty)} type="submit" className='btn content-btn w-100 my-3 text-white'>
              Register
            </button>
          )}
        </form>
      </div>
    </div>
    
  );
}
