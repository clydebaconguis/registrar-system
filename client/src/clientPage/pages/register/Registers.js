import React, { useState } from "react";
import "./registers.css";
import RegisterInput from "../../components/elements/registerInput";
import Logo from "../images/logo.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function Registers() {
  const [message, setMessage] = useState();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Enter Username",
      label: "Username",
      errorMessage:
        "Username should be 6 - 20 characters and no special characters!",
      pattern: "^[A-Za-z0-9]{6,20}$",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Enter Email",
      errorMessage: "It should be a valid email address!",
      label: "Email",
      required: true,
    },
    {
      id: 3,
      name: "password",
      type: "password",
      placeholder: "Enter Password",
      errorMessage: "Password should be 8 - 20 characters",
      pattern: "^[A-Za-z0-9]{6,20}$",
      label: "Password",
      required: true,
    },
    {
      id: 4,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Password don't match !",
      pattern: values.password,
      label: "Confirm Password",
      required: true,
    },
  ];

  const handleInputChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const registerSubmit = async (e) => {
    e.preventDefault();

    const { confirmPassword, ...Information } = values;
    try {
      const res = await axios.post(
        `http://localhost:3001/api/auth/register`,
        Information
      );
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response.data);
    }
  };

  const registerCancel = () => {
    navigate("/login");
  };

  return (
    <div className="registers-main-container">
      <form className="registers-form" onSubmit={registerSubmit}>
        <img className="registers-img" src={Logo} />
        <h1 className="registers-title">R e g i s t e r</h1>
        {inputs.map((input) => (
          <RegisterInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={handleInputChange}
          />
        ))}
        <p>{message}</p>
        <button className="registers-btn">S U B M I T</button>
        <button className="registers-btn" onClick={registerCancel}>
          C A N C E L
        </button>
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
      </form>
    </div>
  );
}

export default Registers;
