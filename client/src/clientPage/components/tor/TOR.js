import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import "./tor.css";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { Box } from "@mui/material";
import FormInput from "../elements/forminput";
import FormSelectInputs from "../elements/formselectinputs";
import { TiArrowBack } from "react-icons/ti";

import { yearLevel, monthGraduated, semesters } from "../data";
import Confirm from "../CFRDConfirm/Confirm";
axios.defaults.withCredentials = true;
function TOR() {
  const site = useLocation();
  const [values, setValues] = useState({
    schoolYear: "",
    semester: "",
    firstname: "",
    lastname: "",
    schoolId: "",
    middlename: "",
    email: "",
    currentAddress: "",
    phoneNumber: "",
    yearlevel: "",
    course: "",
    enrollmentStatus: "",
    lastSchoolYearAttended: "",
    currentSemester: "",
  });
  const [fileInputChange, setFileInputChange] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSelectedFile(reader.result);
    };
  };

  axios.defaults.withCredentials = true;
  const [courseList, setCourseList] = useState([]);
  const [isGraduate, setIsGraduate] = useState(false);
  const [isNotEnrolled, setIsNotEnrolled] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [succesMessage, setSuccessMessage] = useState();
  const [selectedCertificate, setSelectedCertificate] = useState([]);
  const [selectedCertificate1, setSelectedCertificate1] = useState([]);
  const [purpose, setPurpose] = useState();
  const [isTor, setIsTor] = useState(false);
  const [showForm, setShowForm] = useState(false);
  let currentYear = new Date().getFullYear();
  const { currentUser } = useContext(AuthContext);
  const year = 100;
  const message = "Request Succesfull";
  const schoolYears = [];
  for (let i = 0; i < year; i++) {
    schoolYears.push(`${currentYear - i}-${currentYear - i + 1}`);
  }

  const Reference = [
    {
      ID: 1,
      Title: "REFERENCE",
    },
    {
      ID: 2,
      Title: "BOARD EXAMINATION",
      enable: isGraduate ? false : true,
    },
    {
      ID: 3,
      Title: "EMPLOYMENT",
    },
  ];

  const certificates = [
    {
      ID: 1,
      Description: "CURRENTLY ENROLLED",
    },
    {
      ID: 2,
      Description: "HIGHEST EDUCATIONAL ATTAINMENT",
    },
    {
      ID: 3,
      Description:
        "HIGHEST EDUCATIONAL ATTAINMENT WITH UNITS EARNED(FOR RED RIBBON)",
    },
    {
      ID: 4,
      Description: "NUMBER OF UNITS EARNED",
    },
    {
      ID: 5,
      Description: "COMPLETED THE REQUIRED UNITS FOR GRADUATION",
    },
    {
      ID: 7,
      Description: "GRADES WITH WEIGHTED AVERAGE",
    },
    {
      ID: 8,
      Description: "GENERAL WEIGHTED AVERAGE",
    },
    {
      ID: 9,
      Description: "CROSS ENROLLEE FINAL GRADES",
    },
    {
      ID: 10,
      Description: "DIPLOMA",
      disabled: isGraduate ? false : true,
    },
  ];

  const schoolYearGraduted = [];
  for (let i = 0; i < year; i++) {
    schoolYearGraduted.push(`${currentYear - i}`);
  }

  const [check, setCheck] = useState(false);

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    if (e.target.checked) {
      setSelectedCertificate([...selectedCertificate, value]);
    } else {
      setSelectedCertificate(
        selectedCertificate.filter((certificate) => certificate !== value)
      );
    }
  };

  const inputs = [
    {
      id: 1,
      type: "text",
      name: "firstname",
      placeholder: "Enter First Name",
      label: "First Name",
      errorMessage:
        "Please enter your first name for fast validation and approval",
      pattern: "^[A-Za-z ]{2,30}$",
      required: true,
    },
    {
      id: 2,
      type: "text",
      name: "lastname",
      placeholder: "Enter Last Name",
      label: "Last Name",
      errorMessage:
        "Please enter your last name for fast validation and approval",
      pattern: "^[A-Za-z ]{1,40}$",
      required: true,
    },
    {
      id: 3,
      type: "text",
      name: "middlename",
      placeholder: "Enter Middle Name",
      label: "Middle Name",
      errorMessage:
        "Please enter your Middle name for fast validation and approval",
      pattern: "^[A-Za-z ]{1,40}$",
      required: true,
    },
    {
      id: 4,
      type: "text",
      name: "schoolId",
      placeholder: "Enter School ID",
      label: "School ID",
      errorMessage:
        "Please enter your valid schoold id for fast validation and approval",
      pattern: "^[0-9-@]{11,14}$",
    },
    {
      id: 6,
      type: "text",
      name: "phoneNumber",
      placeholder: "Enter Phone Number",
      label: "Phone Number",
      errorMessage: "Please enter your phone number",
      pattern: "^[0-9]{11,13}$",
      required: true,
    },
    {
      id: 7,
      name: "email",
      type: "email",
      placeholder: "Enter Email",
      errorMessage: "It should be a valid email address!",
      label: "Email",
      required: true,
    },
  ];

  const address = [
    {
      id: 1,
      type: "text",
      name: "currentAddress",
      placeholder: "Enter Current Address",
      label: "Current Address",
      errorMessage: "Please enter your current address",
      pattern: "^[A-Za-z0-9!@#$%^&*()_+ ]{1,200}$", // "^(?=.*[0-9])(?=.*[!@#$%^&*()]){1,50}$",
      required: true,
    },
  ];

  const selectedInputs = [
    {
      id: 1,
      type: "select",
      name: "course",
      placeholder: "Select Course",
      label: "Course(select)",
      title: "Select Course",
      required: true,
      options: courseList,
    },
    {
      id: 2,
      type: "select",
      name: "yearlevel",
      placeholder: "Select Year",
      title: "Select Year",
      label: "Year Level",
      required: isGraduate ? false : true,
      options: yearLevel,
      disabled: isGraduate,
    },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const abortController = new AbortController();
      try {
        const res = await axios.get(
          "http://localhost:3001/api/status/courses",
          {
            signal: abortController.signal,
          }
        );
        if (isMounted) {
          setCourseList(res.data);
          getProfile();
        }
      } catch (err) {
        console.log(err);
      }
      return () => {
        abortController.abort();
        isMounted = false;
      };
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/status/profile/${currentUser.User_ID}`
      );
      const profiledata = res.data;
      setValues({
        firstname: profiledata ? profiledata[0].Student_firstName : "",
        lastname: profiledata ? profiledata[0].Student_lastName : "",
        schoolId: profiledata ? profiledata[0].Student_schoolID : "",
        middlename: profiledata ? profiledata[0].Student_middleName : "",
        currentAddress: profiledata
          ? profiledata[0].Student_currentAddress
          : "",
        phoneNumber: profiledata ? profiledata[0].Student_phoneNumber : "",
        yearlevel: profiledata ? profiledata[0].Student_yearLevel : "",
        course: profiledata ? profiledata[0].course : "",
        enrollmentStatus: profiledata
          ? profiledata[0].Student_enrollmentStatus
          : "",
        lastSchoolYearAttended: profiledata
          ? profiledata[0].Student_lastSchoolYearAttended
          : "",
        currentSemester: profiledata ? profiledata[0].semester : "",
        email: profiledata ? profiledata[0].email : "",
      });
      renderEnrollmentStatus(profiledata[0].Student_enrollmentStatus);
    } catch (err) {
      console.log(err);
    }
  };

  const renderEnrollmentStatus = (enrollmentStatus) => {
    if (enrollmentStatus === "Not Enrolled") {
      setIsNotEnrolled(true);
      setIsGraduate(false);
    } else if (enrollmentStatus === "Graduated") {
      setIsGraduate(true);
      setIsNotEnrolled(false);
    } else {
      setIsGraduate(false);
      setIsNotEnrolled(false);
      values.enrollmentStatus = "Enrolled";
      console.log("");
    }
  };



  if (!check) {
    values.schoolYear = "";
    values.semester = "";
  }

  const getCourseID = (course, courselist) => {
    for (let i = 0; i < courselist.length; i++) {
      if (course === courselist[i].Course_Description) {
        values.course = courselist[i].Course_ID;
      }
    }
  };

  const submitRequest = async (e) => {
    console.log("asd");
    getCourseID(values.course, courseList);
    if (!isNotEnrolled && !isGraduate) {
      values.semester = "N/A";
      values.lastSchoolYearAttended = "N/A";
    }
    renderEnrollmentStatus(values.enrollmentStatus);
    try {
      const res = await axios.post(
        `http://localhost:3001/api/request/addRequest`,
        {
          User_ID: currentUser.User_ID,
          purpose: purpose,
          certificates: JSON.stringify(selectedCertificate),
          document_ID: 1,
          firstname: values.firstname,
          lastname: values.lastname,
          middlename: values.middlename,
          schoolId: values.schoolId,
          email: values.email,
          currentAddress: values.currentAddress,
          phoneNumber: values.phoneNumber,
          yearlevel: values.yearlevel,
          course: values.course,
          enrollmentStatus: values.enrollmentStatus,
          lastSchoolYearAttended: values.lastSchoolYearAttended,
          semesters: values.currentSemester,
          file: selectedFile,
        }
      );
      setSuccessMessage(res.data);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);

      setShowForm(!showForm);
      alert(message);
      window.location.href = "/homepage";
    } catch (err) {
      alert(err.response.data);
      setErrorMessage(err.response.data);
    }
  };

  const handleInputChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // onSubmit={submitRequest}
  const setShowFormInfo = (e) => {
    e.preventDefault();
    const data = [];
    if (selectedCertificate.length <= 0 && selectedCertificate1.length <= 0) {
      return setErrorMessage(
        "Please choose the certificates you want to request"
      );
    } 
    // else {
    //   if (check && values.semester && values.schoolYear) {
    //     data = `FINAL GRADES OF ${values.semester} SEMESTER/SUMMER S.Y ${values.schoolYear}`;
    //     selectedCertificate.push(data);
    //   }
    // }

    if (!selectedFile) {
      return setErrorMessage("Please upload a 2x2 picture");
    }
    setShowForm(!showForm);
  };

  const backToHomePage = () => {
    window.location.href = "/homepage";
  };

  console.log(values);
  return (
    <Box className="tor-main-container">
      {showForm && (
        <div className="confirm-popups">
          <Confirm
            user={values}
            onSubmit={submitRequest}
            onCancel={setShowFormInfo}
            allCerticates={selectedCertificate}
            image={selectedFile}
            purpose={purpose}
          />
        </div>
      )}

      <form className="first-container" onSubmit={setShowFormInfo}>
        <div className="tor-upload-image-container">
          <TiArrowBack className="back-icon" onClick={backToHomePage} />
          <div className="tor-title-container">
            <h1>Clearance For Requisition Of Documents</h1>
          </div>
          <div className="tor-image-main-container">
            <div className="tor-image-container">
              {selectedFile ? (
                <img src={selectedFile} className="tor-image" alt="" />
              ) : (
                "Please Upload a 2x2 picture"
              )}
            </div>
            <div className="input-file-label-container">
              <label htmlFor="file-input" className="input-file-label">
                Upload File
              </label>
              <input
                type="file"
                name="image"
                className="image-input"
                id="file-input"
                value={fileInputChange}
                onChange={handleFileChange}
                placeholder="Select 2x2 Picture"
              />
            </div>
          </div>
        </div>
        <div className="tor-top-inputs-container">
          {inputs.map((input) => (
            <div key={input.id} className="tor-top-inputs">
              <FormInput
                {...input}
                value={values[input.name]}
                onChange={handleInputChange}
                disabled={showForm}
              />
            </div>
          ))}
        </div>
        <div className="tor-top-inputs-container">
          {selectedInputs.map((input) => (
            <div key={input.id} className="tor-top-inputs">
              <FormSelectInputs
                key={input.id}
                {...input}
                value={values[input.name]}
                onChange={handleInputChange}
                disabled={input.disabled || showForm}
              />
            </div>
          ))}
        </div>
        <div>
          {address.map((input) => (
            <div key={input.id} className="tor-input-email">
              <FormInput
                {...input}
                value={values[input.name]}
                onChange={handleInputChange}
                disabled={showForm}
              />
            </div>
          ))}
        </div>
        <div className="tor-radio-button">
          <div className="-select">
            <label>
              <input
                disabled={showForm}
                type="radio"
                name="enrollmentStatus"
                value="Enrolled"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                onClick={(e) => {
                  setIsGraduate(false);
                  setIsNotEnrolled(false);
                }}
                checked={!isGraduate && !isNotEnrolled ? true : false}
              />
              ENROLLED
            </label>
          </div>
          <div className="tor-select-top">
            <label>
              <input
                disabled={showForm}
                type="radio"
                name="enrollmentStatus"
                value="Not Enrolled"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                onClick={(e) => {
                  setIsGraduate(false);
                  setIsNotEnrolled(true);
                }}
                checked={isNotEnrolled ? true : false}
              />
              NOT ENROLLED
            </label>
            {isNotEnrolled && (
              <div className="tor-notenrolled">
                <label>Last school year attended:</label>
                <select
                  className="tor-notenrolled-select"
                  name="currentSemester"
                  onChange={handleInputChange}
                  value={values.currentSemester}
                  required={isNotEnrolled}
                  disabled={showForm}
                >
                  <option value="">SELECT SEMESTER</option>
                  {semesters.map((semester) => (
                    <option value={semester} key={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
                <select
                  name="lastSchoolYearAttended"
                  className="tor-notenrolled-select"
                  value={values.lastSchoolYearAttended}
                  onChange={handleInputChange}
                  disabled={showForm}
                >
                  <option value="">SELECT YEAR</option>
                  {schoolYears.map((year) => (
                    <option value={year} key={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="tor-select-top">
            <label>
              <input
                type="radio"
                name="enrollmentStatus"
                value="Graduated"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                onClick={(e) => {
                  setIsGraduate(true);
                  setIsNotEnrolled(false);
                }}
                disabled={showForm}
                checked={isGraduate ? true : false}
              />
              GRADUATED
            </label>
            {isGraduate && (
              <div className="tor-notenrolled">
                <select
                  className="tor-notenrolled-select"
                  name="currentSemester"
                  onChange={handleInputChange}
                  placeholder="SELECT SEMESTER"
                  value={values.currentSemester}
                  required={isGraduate}
                  disabled={showForm}
                >
                  <option value="">MONTH GRADUATED</option>
                  {monthGraduated.map((month) => (
                    <option value={month.description} key={month.id}>
                      {month.description}
                    </option>
                  ))}
                </select>
                <select
                  className="tor-notenrolled-select"
                  name="lastSchoolYearAttended"
                  onChange={handleInputChange}
                  value={values.lastSchoolYearAttended}
                  required={isGraduate}
                  disabled={showForm}
                >
                  <option value="">YEAR GRADUATED</option>
                  {schoolYearGraduted.map((year) => (
                    <option value={year} key={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="tor-form-text">
          <div className="tor-title-top">
            <span>REQUEST FOR (Please Check)</span>
          </div>
        </div>
        <span className="tor-title">CERTIFCATES</span>
        <div>
          <label>
            <input
              type="checkbox"
              name="certificates"
              value="TRANSCRIPT OF RECORDS"
              onChange={handleCheckboxChange}
              onClick={() => setIsTor(!isTor)}
              disabled={showForm}
            />
            TRANSCRIPT OF RECORDS(T.O.R)
          </label>
        </div>
        {isTor && (
          <div className="tor-purpose">
            <span className="">PURPOSE:</span>
            {Reference.map((Reference) => (
              <label key={Reference.ID}>
                <input
                  type="radio"
                  name="purpose"
                  required={isTor ? true : false}
                  value={Reference.Title}
                  disabled={Reference.enable || showForm}
                  onChange={(e) => setPurpose(e.target.value)}
                />
                {Reference.Title}
              </label>
            ))}
          </div>
        )}

        {certificates.map((data, key) => (
          <div className="tor-second-container" key={data.ID}>
            <label className="tor-certificates-container">
              <input
                type="checkbox"
                name="certificates"
                value={data.Description}
                onChange={handleCheckboxChange}
                disabled={showForm || data.disabled}
              />
              {data.Description}
            </label>
          </div>
        ))}

        {/* <div className="tor-certificates-container">
          <label>
            <input
              type="checkbox"
              name="certificates"
              value="Final Grades of SEMESTER/SUMMER S.Y"
              onChange={handleCheckboxChange1}
            />
            Final Grades Of
          </label>
          <select
            name="semester"
            className="tor-select"
            value={values.semester}
            onChange={handleInputChange}
            disabled={showForm}
          >
            <option value="" disabled>
              Select Semester
            </option>
            {semesters.map((semesters) => (
              <option key={semesters} value={semesters}>
                {semesters}
              </option>
            ))}
          </select>
          ` AY`
          <select
            className="tor-select"
            name="schoolYear"
            value={values.schoolYear}
            onChange={handleInputChange}
            disabled={showForm}
          >
            <option value="" disabled>
              Select Year
            </option>
            {schoolYears.map((schoolYear) => (
              <option key={schoolYear} value={schoolYear}>
                {schoolYear}
              </option>
            ))}
          </select>
        </div> */}

        <div className="tor-message">
          {errorMessage ? (
            <span className="error-message">{errorMessage}</span>
          ) : (
            <span className="success-message">{succesMessage}</span>
          )}
        </div>
        <div className="info-text">
          <span className="add-request-info">
            Please make sure you fill the profile and form requirements
          </span>

          <span className="add-request-info">
            for accurate validation and fast approval
          </span>
        </div>
        <div className="tor-btn-container">
          <div className="tor-btn-container">
            <button className="tor-btn" disabled={showForm} type="submit">
              SUBMIT
            </button>
            <button
              className="tor-btn CANCEL"
              onClick={backToHomePage}
              disabled={showForm}
            >
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </Box>
  );
}

export default TOR;
