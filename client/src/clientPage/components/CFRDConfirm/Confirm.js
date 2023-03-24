import React, { useState } from "react";
import "./confirm.css";
function Confirm({ user, onSubmit, allCerticates, image, onCancel, purpose }) {
  const array = [""];
  const certificates = allCerticates ? allCerticates : array;
  const filteredCertificates = certificates.filter(
    (cert) => cert !== "TRANSCRIPT OF RECORDS"
  );
  const TOR = certificates.filter((cert) => cert === "TRANSCRIPT OF RECORDS");

  const [disableButton, setDisableButton] = useState(false);

  return (
    <>
      <div className="confirm-hdprofile-top">
        <div className="client-page-top">
          <h1>{user.document}</h1>

          <div className="tor-upload-image-container">
            <div className="tor-title-container">
              <span>Clearance For Requisition Of Documents</span>
            </div>
            <div className="tor-image-main-container">
              <div className="confirm-tor-image-container">
                <img src={image} className="tor-image" alt="" />
              </div>
            </div>
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
              <span className="profile-forminput-input">
                {user.middlename}{" "}
              </span>
            </div>
            <div className="profile-top-inputs">
              <label className="profile-forminput-label">School ID</label>
              <span className="profile-forminput-input">{user.schoolId}</span>
            </div>
            <div className="profile-top-inputs">
              <label className="profile-forminput-label">Phone Number</label>
              <span className="profile-forminput-input">
                {user.phoneNumber}
              </span>
            </div>
            <div className="profile-top-inputs-email">
              <label className="profile-forminput-label">Email</label>
              <span className="profile-forminput-input-email">
                {user.email}
              </span>
            </div>
            <div className="profile-top-inputs-course">
              <label className="profile-forminput-label">Course</label>
              <span className="profile-forminput-input-course">
                {user.course}
              </span>
            </div>
            <div className="profile-top-inputs">
              <label className="profile-forminput-label">Year Level</label>
              <span className="profile-forminput-input">
                {user.yearlevel ? user.yearlevel : "NO YEAR LEVEL "}
              </span>
            </div>
            <div className="profile-top-inputs-address">
              <label className="profile-forminput-label">Current Address</label>
              <span className="profile-forminput-input">
                {user.currentAddress}{" "}
              </span>
            </div>
            <div className="profile-top-inputs">
              <label className="profile-forminput-label">
                Enrollment Status
              </label>
              {user.enrollmentStatus === "Graduated" && (
                <>
                  <label>
                    {`${user.enrollmentStatus} on ${user.currentSemester} year ${user.lastSchoolYearAttended}`}
                  </label>
                </>
              )}
              {user.enrollmentStatus === "Not Enrolled" && (
                <>
                  {user.enrollmentStatus}
                  <label className="profile-forminput-label">
                    Last school year attended
                  </label>
                  {`${user.currentSemester} AY ${user.lastSchoolYearAttended}`}
                </>
              )}
              {user.enrollmentStatus === "Enrolled" && (
                <div className="profile-top-inputs">
                  {user.enrollmentStatus}
                </div>
              )}
            </div>
            <div className="profile-top-inputs-line">
              {TOR.length > 0 && (
                <div className="client-top-tor-container">
                  <label className="client-top-tor">{TOR}</label>
                  <label className="client-top-purpose">
                    {"Purpose: " + purpose}
                  </label>
                </div>
              )}
              <div className="profile-top-inputs-address">
                <div className="client-top-tor-container">
                  <label>
                    {TOR && filteredCertificates.length === 0
                      ? ""
                      : "CERTIFICATES"}
                  </label>
                  {filteredCertificates
                    ? filteredCertificates.map((certificates) => (
                        <span className="client-top-purpose" key={certificates}>
                          {certificates}
                        </span>
                      ))
                    : user.certificates}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tor-btn-container">
          <div className="tor-btn-container">
            <button
              disabled={disableButton}
              className="tor-btn"
              onClick={() => {
                setDisableButton(!disableButton);
                onSubmit();
              }}
            >
              CONFIRM
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
