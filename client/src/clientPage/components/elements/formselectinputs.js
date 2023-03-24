import React from "react";
import "./formselectinputs.css";

function FormSelectInputs(props) {
  const { title, label, options, onChange, id, ...others } = props;

  return (
    <div className="forminput-main-container">
      <label className="forminput-label">{label}</label>
      <select className="forminput-input " {...others} onChange={onChange}>
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

export default FormSelectInputs;
