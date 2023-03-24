import React from "react";
import "./container.css";
import { CgFileDocument } from "react-icons/cg";
import { MdDateRange } from "react-icons/md";
import { TbUserCircle } from "react-icons/tb";
import { BsBook } from "react-icons/bs";
import { GrStatusUnknown } from "react-icons/gr";
import { FaUserTie, FaFileSignature } from "react-icons/fa";

function container({ props }) {
  // Array.isArray(props.Departments)
  // ?
  const department = props.Departments.split(`,`);
  const status = props.approvals.split(`,`);
  const message = props.messages.split(`|`);
  const date = props.messageDates.split(`|`);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const myDate = new Date(props.releaseDate);
  const dateApprove = myDate.toLocaleString(undefined, options);
  return (
    <div className="container-main">
      <div className="container-first">
        <div className="container-left">
          <div className="container-right-description">
            <h3 className="container-status-text">
              <FaUserTie className="top-icon" />
              Student's Information
            </h3>
          </div>
          <div className="container-left-description">
            {props.approval && (
              <>
                <span className="container-title">
                  <TbUserCircle className="container-icon" />
                  DOCUMENT STATUS
                </span>
                <span className={`${props.approval}`}>{props.approval}</span>
              </>
            )}
          </div>
          <div className="container-left-description">
            <span className="container-title">
              <TbUserCircle className="container-icon" />
              Full Name:
            </span>
            <span className="container-text">{`${props.lname} ${props.fname} ${props.mname}`}</span>
          </div>
          <div className="container-left-description">
            <span className="container-title">
              <BsBook className="container-icon" />
              Course:
            </span>
            <span className="container-text">{props.course}</span>
          </div>
          <div className="container-left-description">
            <span className="container-title">
              <CgFileDocument className="container-icon" />
              Document Requested
            </span>
            <span className="container-text">{props.document}</span>
          </div>
          <div className="container-left-description">
            <span className="container-title">
              <MdDateRange className="container-icon" />
              Date Requested
            </span>
            <span className="container-text">{props.requestDate}</span>
          </div>
          <div className="container-left-description">
            <span className="container-title">
              <MdDateRange className="container-icon" />
              Release Date
            </span>
            <span className="container-text">
              {props.releaseDate && dateApprove}
            </span>
          </div>
        </div>
        <div className="container-right">
          <div className="container-right-description">
            <h3 className="container-status-text">
              <GrStatusUnknown className="top-icon" />
              Status
            </h3>
          </div>
          {department.map((department, index) => (
            <div className="container-right-description" key={department}>
              <div>
                <span className="container-title">
                  <FaFileSignature className="container-icon" />
                  {department}
                </span>
              </div>
              <div>
                <span className={`${status[index]}`}>{status[index]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container-second">
        <div
          className={
            props.messages === "NO" ? "" : "container-message-main-container"
          }
        >
          {props.messages === "NO"
            ? ""
            : message.map((message, index) => (
                <div className="message-container" key={index}>
                  <span className="message-date">{date[index]}</span>
                  <span className="messages">{message}</span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default container;
