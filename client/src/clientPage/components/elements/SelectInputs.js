import React from "react";
import "./selectInputs.css";

function SelectInputs(props) {
  const { title, label, options, onChange, id, ...others } = props;

  return (
    <div className="profile-input-container">
      <label className="registerinput-label">{label}</label>
      <select className="profile-select " {...others} onChange={onChange}>
        <option value="">{title}</option>
        {options.map((courses) => (
          <option key={courses.Course_ID} value={courses.Course_Description}>
            {courses.Course_Description}
          </option>
        ))}
        .
      </select>
    </div>
  );
}

export default SelectInputs;
