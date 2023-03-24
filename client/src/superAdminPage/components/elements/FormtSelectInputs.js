import React from "react";

function FormSelectInputs(props) {
  const { title, label, options, onChange, id, ...others } = props;

  return (
    <div className="forminput-main-container">
      <label className="forminput-label">{label}</label>
      <select className="forminput-input " {...others} onChange={onChange}>
        <option value="">{title}</option>
        {options.map((value) => (
          <option key={value.id} value={value.description}>
            {value.description}
          </option>
        ))}
        .
      </select>
    </div>
  );
}

export default FormSelectInputs;
