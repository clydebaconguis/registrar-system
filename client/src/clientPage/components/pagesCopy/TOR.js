import "./tor.css";
import React, { useState } from "react";
import { Reference, certificates, semesters } from "../data";
import { Box } from "@mui/material";
function TOR() {
  let currentYear = new Date().getFullYear();
  const year = 100;
  const schoolYears = [];
  for (let i = 0; i < year; i++) {
    schoolYears.push(`${currentYear - i}-${currentYear - i + 1}`);
  }
  const isDisabled = true;
  return (
    <Box className="tor-copy-main-container">
      <form className="tor-copy-first-container">
        <div className="tor-copy-form-text">
          <h1>TRANSCRIPT OF RECORDS(T.O.R)</h1>
        </div>
        <h2 className="">PURPOSE:</h2>
        <div className="tor-copy-purpose">
          {Reference.map((Reference) => (
            <label key={Reference.ID}>
              <input type="radio" disabled={isDisabled} />
              {Reference.Title}
            </label>
          ))}
        </div>
        <h2 className="">C E R T I F I C A T E S</h2>
        {certificates.map((data, key) => (
          <div className="tor-copy-second-container" key={data.ID}>
            <label className="tor-copy-certificates-container">
              <input type="checkbox" disabled={isDisabled} />
              {data.Description}
            </label>
          </div>
        ))}

        <div className="tor-copy-certificates-container">
          <label>
            <input type="checkbox" disabled={isDisabled} />
            Final Grades Of
          </label>
          <select className="tor-copy-select" disabled={isDisabled}>
            <option value="" disabled>
              Select Semester
            </option>
            {semesters.map((semesters) => (
              <option key={semesters} value={semesters}>
                {semesters}
              </option>
            ))}
          </select>
          ` S.Y`
          <select className="tor-copy-select" disabled={isDisabled}>
            <option value="" disabled>
              Select Year
            </option>
            {schoolYears.map((schoolYear) => (
              <option key={schoolYear} value={schoolYear}>
                {schoolYear}
              </option>
            ))}
          </select>
        </div>
        <div className="info-text">
          <span className="tor-copy-add-request-info">
            Please make sure you fill the profile and form requirements
          </span>

          <span className="tor-copy-add-request-info">
            for accurate validation and fast approval
          </span>
        </div>
      </form>
    </Box>
  );
}

export default TOR;
