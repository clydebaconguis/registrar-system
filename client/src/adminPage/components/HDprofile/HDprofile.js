import React, { useState } from "react";
// import Image from "../../pageAdmin/components/images/image1.webp";
// import FormInput from "../elements/forminput";
function HDprofile({ props }) {
  const approvalDate = props[0].approvalDate
    ? props[0].approvalDate.split(`,`)
    : "";
  const approvals = props[0].approvals ? props[0].approvals.split(`,`) : "";
  const Departments = props[0].Departments
    ? props[0].Departments.split(`,`)
    : [""];

  const message = props[0].messages ? props[0].messages.split(`|`) : "";
  const date = props[0].messageDates ? props[0].messageDates.split(`|`) : "";
  const myDate = new Date(props[0].approveDate);
  const dateApprove = myDate.toLocaleString();
  return (
    <>
      {props.map((user) => (
        <div className="hdprofile-top" key={user.id}>
          <div className="client-page-date">
            {user.approval != "VALIDATING" && (
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
                {user.releaseDate ? ` Release Date: ${user.releaseDate}` : ""}
              </span>
            </div>
          </div>
          <div className="hd-form-text">
            <h1>{user.document}</h1>
          </div>
          <div>
            <h3>Student's Information</h3>
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
          </div>
          {Departments.length >= 6 ? (
            <div className="hdprofile-page-status-container">
              {Departments.map((Departments, index) => (
                <div className="client-page-status" key={index}>
                  <div>
                    <span className="client-status">{Departments}:</span>
                    <span className={`client-status ${approvals[index]}`}>
                      {approvals[index]}
                    </span>
                  </div>
                  <div className="client-status-date">
                    {"DATE "}
                    <span className="client-status-text">
                      {`${approvals[index]}:`}
                    </span>
                    {approvalDate[index] ? approvalDate[index] : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="hdprofile-page-status-container">
              <div className="client-page-status">
                <div>
                  {"DATE:  "}
                  <span className={`client-status ${user.approval}`}>
                    {user.approval}
                  </span>
                  {" " + user.requestDate}
                </div>
              </div>
            </div>
          )}
          <div className="messages-main-container">
            <div
              className={
                user.messages === "NO" ? "" : "container-message-main-container"
              }
            >
              {user.messages === "NO" || !user.messages
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
      ))}
    </>
  );
}

export default HDprofile;
