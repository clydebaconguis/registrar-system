import axios from "axios";
import React, { useState } from "react";
import "./date.css";
function DatePopUp(props) {
  const [date, setDate] = useState("");
  const [errMessage, setErrMessage] = useState("");

  const handleDateChange = (event) => {
    // get the value of the input field
    const inputDate = event.target.value;

    // convert the input date to a Date object
    const dateObject = new Date(inputDate);

    // create a MySQL datetime string
    const mysqlDatetime = dateObject
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    setDate(mysqlDatetime);
  };

  console.log(date);
  return (
    <form className="date-main-container">
      <div className="date-top">
        <div className="date-input-container">
          <label className="date-label">Add release Date</label>
          <input
            type="date"
            className="date-input"
            placeholder="Enter Your Message."
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="date-bottom-main-container">
        <div className="date-bottom-container">
          <span className="date-text">{`ARE YOU SURE YOU WANT TO ADD RELEASE DATE ON THIS REQUEST ?`}</span>
        </div>
        <div className="date-bottom-container">
          <div
            className="date-bottom date"
            onClick={() => {
              props.onSubmit(props.ID, date);
            }}
          >
            Confirm
          </div>
          <div className="date-bottom cancel" onClick={props.onCancel}>
            Cancel
          </div>
        </div>
        <div className="date-bottom-container">
          <span className="date-text">{errMessage}</span>
        </div>
      </div>
    </form>
  );
}

export default DatePopUp;
