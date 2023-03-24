import React, { useState } from "react";
import "./widget.css";
import { MdPendingActions } from "react-icons/md";
import { MdDocumentScanner, MdOutlineDocumentScanner } from "react-icons/md";
import { Link } from "react-router-dom";
function Widget(props) {
  const [pending, setPending] = useState(0);
  const [approve, setApproved] = useState(0);
  const [decline, setDecline] = useState(0);
  let data;

  const {
    title,
    cName,
    iconContainerClassName,
    iconClassName,
    icon,
    id,
    amount,

    ...others
  } = props;

  return (
    <>
      <div className={iconContainerClassName}>
        <div className="widget-left">
          <span className="widget-title">{title}</span>
          <span className="widget-amount">{amount}</span>

        </div>
        <div className="widget-right">
          <div>
            <div className={iconClassName}>{icon}</div>
          </div>
          <div className="widget-icon-container">
            <MdDocumentScanner className="widget-icon" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Widget;
