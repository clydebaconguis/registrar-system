import React, { useState } from "react";
import axios from "axios";
import "./confirm.css";
function Confirm(props) {
  const [message, setMessage] = useState("");

  return (
    <div
      className={
        props.note === "HOLD" || props.note === "DECLINED"
          ? `confirm-main-container-hold`
          : `confirm-main-container-approved`
      }
    >
      <form className="confirm-form">
        <div className="confirm_top">
          <div
            className={
              props.note === "HOLD"
                ? `confirm-input-container HOLD-`
                : `confirm-input-container APPROVED-`
            }
          >
            <label className="confirm-label">Message</label>
            <textarea
              className="confirm-input"
              placeholder="Enter Your Message."
              onChange={(e) => setMessage(e.target.value)}
              required={true}
            />
          </div>
        </div>
        <div className="confirm-bottom-main-container">
          <div className="confirm-bottom-container">
            <span className="confirm-text">{`SET THE REQUEST OF ${props.name} TO ${props.note} ? `}</span>
          </div>
          <div className="confirm-bottom-container">
            <div
              className="confirm-bottom confirm"
              onClick={() => {
                props.onSubmit(message);
              }}
            >
              Confirm
            </div>
            <div className="confirm-bottom cancel" onClick={props.onConfirm}>
              Cancel
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Confirm;
