import React, { useState } from "react";
import "./confirm.css";
// import Image from "../../pageAdmin/components/images/image1.webp";
// import FormInput from "../elements/forminput";
function Confirm({ user, onSubmit, onCancel }) {
  return (
    <>
      <div className="confirm-hdprofile-top" key={user.id}>
        <div className="tor-title-container">
          <span>Request For Honorable Dissmisal</span>
        </div>
        <div>
          <h3>Student's Information</h3>
        </div>
        <div className="hd-top-inputs-container">
          <div className="profile-top-inputs">
            <label className="profile-forminput-label">First Name</label>
            <span className="profile-forminput-input">{user.firstname} </span>
          </div>

          <div className="profile-top-inputs">
            <label className="profile-forminput-label">Last Name</label>
            <span className="profile-forminput-input">{user.lastname} </span>
          </div>
          <div className="profile-top-inputs">
            <label className="profile-forminput-label">Middle Name</label>
            <span className="profile-forminput-input">{user.middlename} </span>
          </div>
          <div className="profile-top-inputs">
            <label className="profile-forminput-label">School ID</label>
            <span className="profile-forminput-input">{user.schoolId} </span>
          </div>
          <div className="profile-top-inputs">
            <label className="profile-forminput-label">Phone Number</label>
            <span className="profile-forminput-input">{user.phoneNumber} </span>
          </div>
          <div className="profile-top-inputs-email">
            <label className="profile-forminput-label">Email</label>
            <span className="profile-forminput-input-email">{user.email} </span>
          </div>
          <div className="profile-top-inputs-course">
            <label className="profile-forminput-label">Course</label>
            <span className="profile-forminput-input-course">
              {user.course}{" "}
            </span>
          </div>
          <div className="profile-top-inputs">
            <label className="profile-forminput-label">Year Level</label>
            <span className="profile-forminput-input">{user.yearlevel} </span>
          </div>
          <div className="profile-top-inputs-address">
            <label className="profile-forminput-label">Current Address</label>
            <span className="profile-forminput-input">
              {user.currentAddress}{" "}
            </span>
          </div>
          <div className="profile-top-inputs">
            <label className="profile-forminput-label">Enrollment Status</label>
            {user.enrollmentStatus === "Graduated" && (
              <>
                <label>
                  {`${user.enrollmentStatus} on ${user.semesters} year ${user.lastSchoolYearAttended}`}
                </label>
              </>
            )}
            {user.enrollmentStatus === "Not Enrolled" && (
              <>
                {user.enrollmentStatus}
                <label className="profile-forminput-label">
                  Last school year attended
                </label>
                {`${user.semesters} AY ${user.lastSchoolYearAttended}`}
              </>
            )}
            {user.enrollmentStatus === "Enrolled" && (
              <div className="profile-top-inputs">{user.enrollmentStatus}</div>
            )}
          </div>
          <div className="profile-top-inputs-line">
            <div className="profile-top-inputs-address">
              <div className="profile-top-inputs">
                <label className="profile-forminput-label">
                  Last Attendance in Coc
                </label>
                {user.semester + " AY " + user.lastSchoolYear}
              </div>
            </div>
          </div>
          <div className="profile-top-inputs-address">
            <label className="profile-forminput-label">
              School To Transfer
            </label>
            <span className="profile-forminput-input">
              {user.schoolToTransfer}{" "}
            </span>
          </div>
          <div className="profile-top-inputs-remarks">
            <label className="profile-forminput-label">Student Remarks:</label>
            <span className="profile-input-remarks">{user.studentRemarks}</span>
          </div>
          <div className="tor-btn-container">
            <button className="tor-btn" onClick={onSubmit}>
              SUBMIT
            </button>
            <button className="tor-btn CANCEL" onClick={onCancel}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Confirm;
