import React, { useEffect, useState } from "react";
import "./userprofile.css";
import RegisterInput from "../elements/forminput";
import axios from "axios";
import { useLocation } from "react-router-dom";
function Userprofile() {
  const [message, setMessage] = useState();
  const [isDisable, setIsDisable] = useState(true);
  const [isEditEmail, setIsEditEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    currentPassword: "",
    newPassword: "",
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
      button: (
        <button
          className="user-profile-btn"
          onClick={(e) => {
            setIsEdit(false);
            setIsDisable(false);
            setIsEditEmail(true);
            e.preventDefault();
          }}
        >
          EDIT
        </button>
      ),
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
      button: (
        <button
          className="user-profile-btn"
          onClick={(e) => {
            setIsEdit(true);
            setIsDisable(false);
            setIsEditEmail(false);
            e.preventDefault();
          }}
        >
          EDIT
        </button>
      ),
    },
  ];

  const changeEmail = [
    {
      id: 1,
      name: "currentPassword",
      type: "password",
      placeholder: "Enter Current Password",
      errorMessage: "Password should be 8 - 20 characters",
      pattern: "^[A-Za-z0-9]{6,20}$",
      label: "Current Password",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Enter New Email",
      errorMessage: "It should be a valid email address!",
      label: "New Email",
      required: true,
      button: <button className="user-profile-btn">EDIT</button>,
    },
  ];

  const changePassword = [
    {
      id: 1,
      name: "currentPassword",
      type: "password",
      placeholder: "Enter Current Password",
      errorMessage: "Password should be 8 - 20 characters",
      pattern: "^[A-Za-z0-9]{6,20}$",
      label: "Current Password",
      required: true,
    },
    {
      id: 2,
      name: "newPassword",
      type: "password",
      placeholder: "Enter New Password",
      errorMessage: "Password should be 8 - 20 characters",
      pattern: "^[A-Za-z0-9]{6,20}$",
      label: "New Password",
      required: true,
    },
    {
      id: 3,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm New Password",
      errorMessage: "New Password don't match !",
      pattern: values.newPassword,
      label: "Confirm New Password",
      required: true,
    },
  ];

  const handleInputChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const site = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      getUserProfile();
    };

    fetchData();
  }, [site]);

  const getUserProfile = async () => {
    setMessage("");
    setErrorMessage("");
    try {
      const res = await axios.get(
        "http://localhost:3001/api/status/getUserProfile"
      );
      const profiledata = res.data;

      setValues({
        username: profiledata ? profiledata[0].username : "",
        email: profiledata ? profiledata[0].email : "",
        password: profiledata ? profiledata[0].password : "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const editEmail = async (e) => {
    setMessage("");
    setErrorMessage("");
    e.preventDefault();
    const { username, password, confirmPassword, newPassword, ...newemail } =
      values;
    try {
      const res = await axios.put(
        "http://localhost:3001/api/auth/editemail",
        newemail
      );
      setMessage(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response.data);
    }
  };

  const editPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");
    const { username, email, password, confirmPassword, ...newpassword } =
      values;
    try {
      const res = await axios.put(
        "http://localhost:3001/api/auth/editPassowrd",
        newpassword
      );
      setMessage(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response.data);
    }
  };
  const resetValues = () => {
    values.currentPassword = "";
    values.confirmPassword = "";
    values.newPassword = "";
    setErrorMessage("");
    setMessage("");
  };
  return (
    <div className="userprofile-main-container">
      {!isEdit && !isEditEmail && (
        <div className="userprofile-edit-inputs">
          {inputs.map((input) => (
            <div key={input.id} className="userprofile-inputs">
              <RegisterInput
                {...input}
                value={values[input.name]}
                onChange={handleInputChange}
                disabled={isDisable}
              />
              {input.button}
            </div>
          ))}
        </div>
      )}
      <form>
        {isEditEmail && (
          <div className="userprofile-edit-inputs">
            {changeEmail.map((input) => (
              <div key={input.id} className="userprofile-inputs">
                <RegisterInput
                  {...input}
                  value={values[input.name]}
                  onChange={handleInputChange}
                  disabled={isDisable}
                />
              </div>
            ))}
            <span
              className={`user-error-message ${
                message ? " successful" : " error"
              }`}
            >
              {errorMessage ? errorMessage : ""}
              {message ? message : ""}
            </span>
            <div>
              <button className="user-profile-btn" onClick={editEmail}>
                SUBMIT
              </button>
              <button
                className="user-profile-btn"
                onClick={(e) => {
                  setIsEdit(false);
                  setIsDisable(true);
                  setIsEditEmail(false);
                  getUserProfile();
                  e.preventDefault();
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
        {isEdit && (
          <div className="userprofile-edit-inputs">
            {changePassword.map((input) => (
              <div key={input.id} className="userprofile-inputs">
                <RegisterInput
                  {...input}
                  value={values[input.name]}
                  onChange={handleInputChange}
                  disabled={isDisable}
                />
              </div>
            ))}
            <span
              className={`user-error-message ${
                message ? " successful" : " error"
              }`}
            >
              {errorMessage ? errorMessage : ""}
              {message ? message : ""}
            </span>
            <div>
              <button className="user-profile-btn" onClick={editPassword}>
                SUBMIT
              </button>
              <button
                className="user-profile-btn"
                onClick={(e) => {
                  setIsEdit(false);
                  setIsDisable(true);
                  setIsEditEmail(false);
                  resetValues();
                  e.preventDefault();
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Userprofile;
