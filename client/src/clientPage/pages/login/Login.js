import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../images/logo.png";
import axios from "axios";
import "./login.css";
import { AuthContext } from "../../components/context/authContext";
export default function Login() {
  axios.defaults.withCredentials = true;
  const { login } = useContext(AuthContext);

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

  const navigate = useNavigate();

  const Login = async (e) => {
    e.preventDefault();
    try {
      await login(values.username, values.password);
      navigate("/homepage");
    } catch (err) {
      setMessage(err.response.data);
    }
  };

  return (
    <div className="login-main-container">
      <div className="login-first-container">
        <div className="login-second-container">
          <div className="login-logo-container">
            <img className="login-logo" src={Logo} alt="#" />
          </div>
          <div>
            <h1>LOGIN</h1>
          </div>
          <div className="login-inputs-container">
            <div className="login-input-container">
              <div className="login-inputs">
                <label>Username</label>
              </div>
              <div className="login-inputs">
                <input
                  className="login-input"
                  type="username"
                  name="username"
                  value={values.username}
                  onChange={handleInputChange}
                  placeholder="Enter Username"
                />
              </div>
            </div>
            <div className="login-input-container">
              <div className="login-inputs">
                <label>Password</label>
              </div>
              <div className="login-inputs">
                <input
                  className="login-input"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleInputChange}
                  placeholder="Enter Password"
                />
              </div>
            </div>
            <div className="login-btn-container">
              <button className="login-btn" onClick={Login}>
                Submit
              </button>
            </div>
          </div>
          <div className="register-input-container">{message}</div>
          <div className="login-register-container">
            <div>
              <p>Not a member yet?</p>
            </div>
            <div>
              <Link to="/register" className="login-links">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
