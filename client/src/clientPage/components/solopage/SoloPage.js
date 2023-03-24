import React from "react";
import "./solopage.css";
function SoloPage({ props, Departments, approvals, approvalDate }) {
  const array = [""];

  const certificates = props[0].certificates
    ? JSON.parse(props[0].certificates)
    : array;

  const filteredCertificates = certificates.filter(
    (cert) => cert !== "TRANSCRIPT OF RECORDS"
  );
  const message = props[0].messages.split(`|`);
  const date = props[0].messageDates.split(`|`);
  const TOR = certificates.filter((cert) => cert === "TRANSCRIPT OF RECORDS");

  const myDate = new Date(props[0].approveDate);
  const dateApprove = myDate.toLocaleString();

  const options = { year: "numeric", month: "long", day: "numeric" };
  const myreleaseDate = new Date(props[0].releaseDate);
  const releaseDate = myreleaseDate.toLocaleString(undefined, options);
  return (
    <>
      {props.map((user) => (
        <div className="hdprofile-top" key={user.id}>
          <div className="client-page-top">
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

            <h1>{user.document}</h1>
            <div>
              <h3>Student's Information</h3>
              <img
                className="client-image"
                src={`https://res.cloudinary.com/dsirg7xzw/image/upload/v1678909125/${user.image}`}
                alt=""
              />
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
                <span className="profile-forminput-input">{user.schoolID}</span>
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
                  {user.yearLevel ? user.yearLevel : "NO YEAR LEVEL "}
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
                {TOR.length > 0 && (
                  <div className="client-top-tor-container">
                    <label className="client-top-tor">{TOR}</label>
                    <label className="client-top-purpose">
                      {"Purpose: " + user.purpose}
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
                          <span
                            className="client-top-purpose"
                            key={certificates}
                          >
                            {certificates}
                          </span>
                        ))
                      : user.certificates}
                  </div>
                </div>
                {user.approvals != "VALIDATING" ? (
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
                        <span className={`client-status ${user.approvals}`}>
                          {user.approvals}
                        </span>
                        {" " + user.requestDate}
                      </div>
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
          </div>
        </div>
      ))}
    </>
  );
}

export default SoloPage;
