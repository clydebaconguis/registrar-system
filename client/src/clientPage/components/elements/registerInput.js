import React, { useState } from "react";
import "./registerInput.css";
function RegisterInput(props) {
  const [focused, setFocuse] = useState(false);
  const handleFocus = (e) => {
    setFocuse(true);
  };
  const { label, errorMessage, onChange, id, ...others } = props;
  return (
    <div className="registerinput-main-container">
      <label className="registerinput-label">{label}</label>
      <input
        className="registerinput-input"
        {...others}
        onChange={onChange}
        onBlur={handleFocus}
        focused={focused.toString()}
        onFocus={() => others.name === "confirmPassword" && setFocuse(true)}
      />
      <span className="registerinput-span">{errorMessage}</span>
    </div>
  );
}

export default RegisterInput;
