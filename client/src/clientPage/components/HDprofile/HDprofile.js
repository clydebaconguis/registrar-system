import React, { useState } from "react";
import "./hdprofile.css";
// import Image from "../../pageAdmin/components/images/image1.webp";
// import FormInput from "../elements/forminput";
function HDprofile({ props, departments, approvals, approvalDate }) {
  const message = props[0].messages.split(`|`);
  const date = props[0].messageDates.split(`|`);
  const myDate = new Date(props[0].approveDate);
  const dateApprove = myDate.toLocaleString();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const myreleaseDate = new Date(props[0].releaseDate);
  const releaseDate = myreleaseDate.toLocaleString(undefined, options);
  return (
    <>
      {props.map((user) => (
        <div className="hdprofile-top" key={user.id}>
          <div className="client-page-date">
            {user.approval && (
              <div>
                <div>
                  {"STATUS:  "}
                  <span className={`client-status ${user.approval}`}>
                    {`${user.approval}`}
                  </span>
                </div>
                <div>
                  {"DATE  "}
                  <span className="client-status">{` ${user.approval}: `}</span>
                  {dateApprove}
                </div>
              </div>
            )}
            <div>
              <span>
                {user.releaseDate ? ` Release Date: ${releaseDate}` : ""}
              </span>
            </div>
          </div>
          <div className="hd-form-text">
            <h1>{user.document}</h1>
          </div>
          <div className="hd-top-inputs-container">
            <div className="profile-top-inputs">
              <label className="profile-forminput-label">First Name</label>
              <span className="profile-forminput-input">{user.fname} </span>
            </div>

            <div className="profile-top-inputs">
              <label className="profile-forminput-label">Last Name</label>
              <span className="profile-forminput-input">{user.lname} </span>
            </div>
            <div className="profile-top-inputs">
              <label className="profile-forminput-label">Middle Name</label>
              <span className="profile-forminput-input">{user.mname} </span>
            </div>
            <div className="profile-top-inputs">
              <label className="profile-forminput-label">School ID</label>
              <span className="profile-forminput-input">{user.schoolID} </span>
            </div>
            <div className="profile-top-inputs">
              <label className="profile-forminput-label">Phone Number</label>
              <span className="profile-forminput-input">
                {user.phoneNumber}{" "}
              </span>
            </div>
            <div className="profile-top-inputs-email">
              <label className="profile-forminput-label">Email</label>
              <span className="profile-forminput-input-email">
                {user.email}{" "}
              </span>
            </div>
            <div className="profile-top-inputs-course">
              <label className="profile-forminput-label">Course</label>
              <span className="profile-forminput-input-course">
                {user.course}{" "}
              </span>
            </div>
            <div className="profile-top-inputs">
              <label className="profile-forminput-label">Year Level</label>
              <span className="profile-forminput-input">{user.yearLevel} </span>
            </div>
            <div className="profile-top-inputs-address">
              <label className="profile-forminput-label">Current Address</label>
              <span className="profile-forminput-input">{user.address} </span>
            </div>
            <div className="profile-top-inputs">
              <label className="profile-forminput-label">
                Enrollment Status
              </label>
              {user.status === "Graduated" && (
                <>
                  <label>
                    {`${user.status} on ${user.semester} year ${user.schoolYear}`}
                  </label>
                </>
              )}
              {user.status === "Not Enrolled" && (
                <>
                  {user.status}
                  <label className="profile-forminput-label">
                    Last school year attended
                  </label>
                  {`${user.semester} AY ${user.schoolYear}`}
                </>
              )}
              {user.status === "Enrolled" && (
                <div className="profile-top-inputs">{user.status}</div>
              )}
            </div>
            <div className="profile-top-inputs-line">
              <div className="profile-top-inputs-address">
                <div className="profile-top-inputs">
                  <label className="profile-forminput-label">
                    Last Attendance in Coc
                  </label>
                  {user.semesterTransfer + " AY " + user.year}
                </div>
              </div>
            </div>
            <div className="profile-top-inputs-address">
              <label className="profile-forminput-label">
                School To Transfer
              </label>
              <span className="profile-forminput-input">{user.school} </span>
            </div>

            <div className="profile-top-inputs-remarks">
              <label className="profile-forminput-label">
                Student Remarks:
              </label>
              <span className="profile-input-remarks">
                {user.studentRemarks}
              </span>
            </div>
            <div className="profile-top-inputs-remarks">
              <label className="profile-forminput-label">
                Interviewer Remarks:
              </label>
              <span className="profile-input-remarks">
                {user.interviewerRemarks}
              </span>
            </div>
          </div>
          <div className="hdprofile-page-status-container">
            {user.approvals != "VALIDATING" ? (
              departments.map((departments, index) => (
                <div className="hdprofile-page-status" key={index}>
                  <div>
                    <span className="hdprofile-status">{departments}:</span>
                    <span className={`hdprofile-status ${approvals[index]}`}>
                      {approvals[index]}
                    </span>
                  </div>

                  <div className="hdprofile-status-date">
                    {"DATE "}
                    <span className="hdprofile-status-text">
                      {` ${approvals[index]}:`}
                    </span>
                    {approvalDate[index] ? approvalDate[index] : ""}
                  </div>
                </div>
              ))
            ) : (
              <div className="hdprofile-page-status">
                <div className="hdprofile-status-date">
                  {"DATE:  "}
                  <span className={`hdprofile-status ${user.approvals}`}>
                    {user.approvals}
                  </span>
                  {" " + user.requestDate}
                </div>
              </div>
            )}
            <div className="messages-main-container">
              <div
                className={
                  user.messages === "NO"
                    ? ""
                    : "container-message-main-container"
                }
              >
                {user.messages === "NO"
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
        </div>
      ))}
    </>
  );
}

export default HDprofile;
