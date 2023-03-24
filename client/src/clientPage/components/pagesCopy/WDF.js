import { Box } from "@mui/material";
import React from "react";
import { semesters } from "../data";
import "./wdf.css";
import SelectInputsHD from "../elements/SelectInputsHD";
function WDF() {
  let currentYear = new Date().getFullYear();
  const year = 100;
  const schoolYears = [];
  for (let i = 0; i < year; i++) {
    schoolYears.push(` ${currentYear - (i + 1)}-${currentYear - i} `);
  }

  const selectInputs = [
    {
      id: 1,
      type: "select",
      name: "semester",
      placeholder: "Select semester",
      label: "Semester",
      title: "Select Semester",
      required: true,
      options: semesters,
    },
    {
      id: 2,
      type: "select",
      name: "lastSchoolYear",
      placeholder: "Select School Year",
      label: "School Year",
      title: "Select Year",
      required: true,
      options: schoolYears,
    },
  ];

  return (
    <Box className="copy-main-container">
      <form className="copy-top-container">
        <div className="copy-form-text">
          <h1> WITHDRAWAL FORM</h1>
        </div>
        <div className="copy-top">
          <span className="copy-title">Request to withdraw this</span>
          <div className="copy-top-inputs">
            {selectInputs.map((input) => (
              <SelectInputsHD key={input.id} {...input} />
            ))}
          </div>
          <div className="copy-top">
            <span className="copy-title">
              Units enrolled & witwdrawn:
              <input className="copy-input" type="text" />
            </span>
          </div>
        </div>
        <div className="copy-bottom">
          <div className="copy-text-area">
            <span className="copy-title">Student Remarks:</span>
            <span className="copy-input-text">
              Please specify reasons for requesting honorable dismissal.
            </span>

            <textarea
              className="copy-text"
              placeholder=" Reason 1: .....
            Reason 2: ....."
              required={true}
              rows={10}
              cols={30}
            />
          </div>
          <div className="copy-text-area">
            <span className="copy-title">Interviewer Remarks:</span>
            <span className="copy-input-text">
              Please detail on student's reason/s.
            </span>

            <textarea
              className="copy-text"
              placeholder=" Reason 1: .....
              Reason 2: ....."
              rows={10}
              cols={30}
            />
          </div>
        </div>
        <div className="info-text">
          <span className="add-request-info">
            Please make sure you fill the profile and form requirements
          </span>

          <span className="add-request-info">
            for accurate validation and fast approval
          </span>
        </div>
      </form>
    </Box>
  );
}

export default WDF;
