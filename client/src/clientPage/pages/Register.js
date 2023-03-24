import React, { useState } from "react";
import { Link } from "react-router-dom";
// import Logo from "../images/logo.png";
import "./styles/register.css";
import axios from "axios";

export default function Register() {
  let Username = {
    username: "",
    password: "",
  };

  const [message, setMessage] = useState("");
  const [values, setValues] = useState(Username);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const Register = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3001/api/auth/register`, {
        username: values.username,
        password: values.password,
      });
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response.data);
    }
  };

  return (
    <>
      <div className="register-main-container">
        <div className="register-first-container">
          <div className="register-second-container">
            <div className="register-logo-container">
              {/* <img className="register-logo" src={Logo} /> */}
            </div>
            <div>
              <h1>REGISTER</h1>
            </div>
            <div className="register-inputs-container">
              <div className="register-input-container">
                <div className="register-inputs">
                  <label>Username</label>
                </div>
                <div className="register-inputs">
                  <input
                    className="register-input"
                    type="username"
                    name="username"
                    value={values.username}
                    onChange={handleInputChange}
                    placeholder="Enter Username"
                  />
                </div>
              </div>
              <div className="register-input-container">
                <div className="register-inputs">
                  <label>Password</label>
                </div>
                <div className="register-inputs">
                  <input
                    className="register-input"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleInputChange}
                    placeholder="Enter Password"
                  />
                </div>
              </div>
              <div className="register-btn-container">
                <button className="register-btn" onClick={Register}>
                  Submit
                </button>
              </div>
            </div>
            <div className="register-input-container">{message}</div>

            <div className="register-register-container">
              <div>
                <p>Already have account?</p>
              </div>
              <div>
                <Link to="/login" className="register-links">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
