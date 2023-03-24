import React from "react";
import Image from "../../pageAdmin/components/images/image1.webp";
import "./wdfprofile.css";
function WDFprofile({ props, departments, approvals, approvalDate }) {
  return (
    <>
      {props.map((user) => (
        <div className="wdfprofile-top" key={user.id}>
          <div className="wdfprofile-page-top">
            <div>
              <h1>Withdrawal Form</h1>
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
                <span className="profile-forminput-input">
                  {user.schoolID}{" "}
                </span>
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
                <span className="profile-forminput-input">
                  {user.yearLevel}{" "}
                </span>
              </div>
              <div className="profile-top-inputs-address">
                <label className="profile-forminput-label">
                  Current Address
                </label>
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
                      Request to withdraw this
                    </label>
                    {user.semesterTransfer + " AY " + user.year}
                  </div>
                </div>
              </div>
              <div className="profile-top-inputs-address">
                <label className="profile-forminput-label">
                  Units enrolled & withdrawn:
                  <span className="profile-forminput-unit">{user.units} </span>
                </label>
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
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default WDFprofile;
