import React, { useState } from "react";
import "./widget.css";
import { BsBell } from "react-icons/bs";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { Link } from "react-router-dom";
function Widget(data, { props }) {
  const {
    id,
    newData,
    title,
    totalAmount,
    link,
    linkTitle,
    onClick,

    ...others
  } = data;
  return (
    <div className="admin-widget-container">
      <div className="admin-widget-left">
        <div className="admin-widget-title-container">
          {/* {Title of this chart} */}
          <span>{title}</span>
          {/* total amount of this widget */}
        </div>
        <div className="admin-widget-link">
          <span className="admin-widget-amount">{totalAmount} </span>
        </div>
        <div className="admin-widget-link-container">
          <Link
            to={link}
            onClick={() => onClick(!onClick, id)}
            className="admin-widget-link"
          >
            {linkTitle}
          </Link>
        </div>
      </div>
      <div className="admin-widget-right">
        <div className="admin-alert-container">
          {newData !== 0 && (
            <span className="admin-alert-amount">
              {newData !== 0 && newData}
            </span>
          )}
          <BsBell className="admin-alert-icon" />
        </div>
        <MdOutlineDocumentScanner className="admin-icon" />
      </div>
    </div>
  );
}

export default Widget;
