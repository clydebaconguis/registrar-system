import React from "react";
import "./selectinputsHD.css";
function SelectInputsHD(props) {
  const { title, label, options, id, onChange, ...others } = props;

  return (
    <div className="select-inputs-hd-container">
      <div>
        <label>{label}</label>
      </div>
      <div>
        <select className="select-inputs-HD" {...others} onChange={onChange}>
          <option className="select-input-text" value="">
            {title}
          </option>
          {options.map((options) => (
            <option key={options} value={options}>
              {options}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SelectInputsHD;
