import axios from "axios";
import React from "react";

function ClaimPopUp(props) {
  return (
    <form className={`date-main-container ${props.note}`}>
      <div className="date-bottom-main-container">
        <div className="date-bottom-container">
          <span className="date-text">{`SET THE REQUEST OF ${props.name} TO ${props.note}?`}</span>
        </div>
        <div className="date-bottom-container">
          <div
            className="date-bottom date"
            onClick={() => {
              props.onConfirm(props.ID);
            }}
          >
            Confirm
          </div>
          <div className="date-bottom cancel" onClick={props.onCancel}>
            Cancel
          </div>
        </div>
        <div className="date-bottom-container">
          <span className="date-text"></span>
        </div>
      </div>
    </form>
  );
}

export default ClaimPopUp;
