import React, { useState } from "react";
import "./forminput.css";
function FormInput(props) {
  const [focused, setFocuse] = useState(false);
  const handleFocus = (e) => {
    setFocuse(true);
  };
  const { label, errorMessage, onChange, id, ...others } = props;
  return (
    <div className="forminput-main-container">
      <label className="forminput-label">{label}</label>
      <input
        className="forminput-input"
        {...others}
        onChange={onChange}
        onBlur={handleFocus}
        focused={focused.toString()}
        onFocus={() => others.name === "confirmPassword" && setFocuse(true)}
      />
      <span className="forminput-span">{errorMessage}</span>
    </div>
  );
}

export default FormInput;
