import React from "react";

import "./hd.css";
import { semesters } from "../data";
import SelectInputsHD from "../elements/SelectInputsHD";
// import { Container, Box } from "@mui/material";
import { Box } from "@mui/material";

function HD() {
  let currentYear = new Date().getFullYear();
  const year = 100;
  const schoolYears = [];
  for (let i = 0; i < year; i++) {
    schoolYears.push(` ${currentYear - (i + 1)}-${currentYear - i} `);
  }
  const isDisabled = true;
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
    <Box className="hd-copy-container">
      <form className="hd-top-container">
        <div className="copy-form-text">
          <h1>HONORABLE DISMISSAL</h1>
        </div>
        <div className="copy-top">
          <div className="copy-top-input-container">
            <span className="hd-title">Last Attendance in COC:</span>
            <div className="copy-top-input">
              {selectInputs.map((input) => (
                <SelectInputsHD
                  key={input.id}
                  {...input}
                  disabled={isDisabled}
                />
              ))}
            </div>
          </div>
          <div className="copy-top">
            <span className="hd-title">
              School to Transfer:
              <input className="hd-input" disabled={isDisabled} />
            </span>
            <span className="hd-input-text">
              Please Specify the school name and should not be empty
            </span>
          </div>
        </div>
        <div className="copy-bottom">
          <div className="copy-text-area">
            <span className="hd-title">Student Remarks:</span>
            <span className="hd-input-text">
              Please specify reasons for requesting honorable dismissal.
            </span>
            <textarea
              className="copy-text"
              placeholder=" Reason 1: .....
            Reason 2: ....."
              rows={10}
              cols={30}
              disabled={isDisabled}
            />
          </div>
          <div className="copy-text-area">
            <span className="hd-title">Interviewer Remarks:</span>
            <span className="hd-input-text">
              Please detail on student's reason/s.
            </span>

            <textarea
              className="copy-text"
              placeholder=" Reason 1: .....
              Reason 2: ....."
              rows={10}
              cols={30}
              disabled={isDisabled}
            />
          </div>
          <div className="info-text">
            <span className="add-request-info">
              Please make sure you fill the profile and form requirements
            </span>

            <span className="add-request-info">
              for accurate validation and fast approval
            </span>
          </div>
        </div>
      </form>
    </Box>
  );
}

export default HD;
