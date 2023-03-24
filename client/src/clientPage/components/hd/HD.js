import React, { useContext, useEffect, useState } from "react";
import { yearLevel, monthGraduated, semesters } from "../data";
import "./hd.css";
import SelectInputsHD from "../elements/SelectInputsHD";
import FormSelectInputs from "../elements/formselectinputs";
import { TiArrowBack } from "react-icons/ti";
import { AuthContext } from "../context/authContext";
import { Box } from "@mui/material";
import FormInput from "../elements/forminput";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Confirm from "../HDConfirm/Confirm";
function HD() {
  let currentYear = new Date().getFullYear();
  const { currentUser } = useContext(AuthContext);
  const [courseList, setCourseList] = useState([]);
  const [isGradute, setIsGraduate] = useState(false);
  const [isNotEnrolled, setIsNotEnrolled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  // const [succesMessage, setSuccessMessage] = useState();
  const site = useLocation();
  const year = 100;
  const schoolYears = [];
  for (let i = 0; i < year; i++) {
    schoolYears.push(` ${currentYear - (i + 1)}-${currentYear - i} `);
  }

  const yearGraduated = 100;
  const schoolYearGraduted = [];
  for (let i = 0; i < yearGraduated; i++) {
    schoolYearGraduted.push(`${currentYear - i}`);
  }

  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    schoolId: "",
    email: "",
    currentAddress: "",
    phoneNumber: "",
    yearlevel: "",
    course: "",
    enrollmentStatus: "",
    lastSchoolYearAttended: "",
    semesters: "",
    semester: "",
    schoolToTransfer: "",
    lastSchoolYear: "",
    studentRemarks: "",
    // interviewerRemarks: "",
  });

  const handleInputChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
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
      required: isGradute ? false : true,
      options: yearLevel,
    },
  ];

  const selectInputs = [
    {
      id: 1,
      type: "select",
      name: "semester",
      placeholder: "Select semester",
      label: "Semester",
      title: "Select Semester",
      required: true,
      options: semesters,
    },
    {
      id: 2,
      type: "select",
      name: "lastSchoolYear",
      placeholder: "Select School Year",
      label: "School Year",
      title: "Select Year",
      required: true,
      options: schoolYears,
    },
  ];
  const [focused, setFocuse] = useState(false);
  const handleFocus = (e) => {
    setFocuse(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/status/courses");
        setCourseList(res.data);
      } catch (err) {
        console.log(err);
      }

      getProfile();
    };

    fetchData();
  }, [site]);

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
        email: profiledata ? profiledata[0].Student_emailAddress : "",
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
        semesters: profiledata ? profiledata[0].semester : "",
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
    }
  };
  const getCourseID = (course, courselist) => {
    for (let i = 0; i < courselist.length; i++) {
      if (course === courselist[i].Course_Description) {
        values.course = courselist[i].Course_ID;
      }
    }
  };

  const submitRequest = async (e) => {
    getCourseID(values.course, courseList);
    try {
      const res = await axios.post(
        "http://localhost:3001/api/request/addRequest",
        {
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
          semesters: values.semesters,
          semester: values.semester,
          schoolToTransfer: values.schoolToTransfer,
          lastSchoolYear: values.lastSchoolYear,
          studentRemarks: values.studentRemarks,
          interviewerRemarks: values.interviewerRemarks,
          document_ID: 3,
        }
      );
      alert("Request Succesful");
      backToHomePage();
    } catch (err) {
      alert("ERROR: " + err.response.data);
      console.log(err);
    }
  };

  const setShowFormInfo = (e) => {
    e.preventDefault();
    setShowForm(!showForm);
  };
  const backToHomePage = () => {
    window.location.href = "/homepage";
  };
  return (
    <Box className="hd-main-container">
      {showForm && (
        <div className="confirm-popups">
          <Confirm
            user={values}
            onSubmit={submitRequest}
            onCancel={setShowFormInfo}
          />
        </div>
      )}
      <form className="hd-top-container" onSubmit={setShowFormInfo}>
        <TiArrowBack className="back-icon" onClick={backToHomePage} />
        <div className="hd-form-text">
          <h1>REQUEST FOR HONORABLE DISMISSAL</h1>
        </div>
        <div className="hd-top-inputs-container">
          {inputs.map((input) => (
            <div key={input.id} className="hd-top-inputs">
              <FormInput
                {...input}
                value={values[input.name]}
                onChange={handleInputChange}
                disabled={showForm}
              />
            </div>
          ))}
        </div>
        <div className="hd-top-inputs-container">
          {selectedInputs.map((input) => (
            <div key={input.id} className="hd-top-inputs">
              <FormSelectInputs
                key={input.id}
                {...input}
                value={values[input.name]}
                onChange={handleInputChange}
                disabled={showForm}
              />
            </div>
          ))}
        </div>
        <div>
          {address.map((input) => (
            <div key={input.id} className="hd-input-email">
              <FormInput
                {...input}
                value={values[input.name]}
                onChange={handleInputChange}
                disabled={showForm}
              />
            </div>
          ))}
        </div>
        <div className="hd-radio-button">
          <div className="hd-select">
            <label>
              <input
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
                checked={!isGradute && !isNotEnrolled ? true : false}
                disabled={showForm}
              />
              ENROLLED
            </label>
          </div>
          <div className="hd-select">
            <label>
              <input
                type="radio"
                name="enrollmentStatus"
                value="Not Enrolled"
                onChange={handleInputChange}
                onClick={(e) => {
                  setIsGraduate(false);
                  setIsNotEnrolled(true);
                }}
                checked={isNotEnrolled ? true : false}
                disabled={showForm}
              />
              NOT ENROLLED
            </label>
            {isNotEnrolled && (
              <div className="hd-notenrolled">
                <label className="wdf-notenrolled-select-title">
                  Last school year attended:
                </label>
                <select
                  className="hd-notenrolled-select"
                  name="semesters"
                  onChange={handleInputChange}
                  placeholder="SELECT SEMESTER"
                  value={values.semesters}
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
                  className="hd-notenrolled-select"
                  name="lastSchoolYearAttended"
                  onChange={handleInputChange}
                  value={values.lastSchoolYearAttended}
                  required={isNotEnrolled}
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
        </div>
        <div className="hd-top">
          <div>
            <span className="hd-title">Last Attendance in COC:</span>
            <div className="hd-top-inputs">
              {selectInputs.map((input) => (
                <SelectInputsHD
                  key={input.id}
                  {...input}
                  values={values[input.name]}
                  onChange={handleInputChange}
                  disabled={showForm}
                />
              ))}
            </div>
          </div>
          <div className="hd-top">
            <span className="hd-title">
              School to Transfer:
              <input
                className="hd-input"
                type="text"
                name="schoolToTransfer"
                required={true}
                placeholder="Enter School Name"
                value={values.schoolToTransfer}
                onChange={handleInputChange}
                focused={focused.toString()}
                onBlur={handleFocus}
                pattern={"^[A-Za-z0-9 !@#$%^&()]{1,200}$"}
                disabled={showForm}
              />
            </span>
            <span className="hd-input-text">
              Please Specify the school name and should not be empty
            </span>
          </div>
        </div>
        <div className="hd-bottom">
          <div className="hd-text-area">
            <span className="hd-title">Student Remarks:</span>
            <span className="hd-input-text">
              Please specify reasons for requesting honorable dismissal.
            </span>

            <textarea
              name="studentRemarks"
              className="hd-text"
              placeholder=" Reason 1: .....
            Reason 2: ....."
              required={true}
              value={values.studentRemarks}
              onChange={handleInputChange}
              rows={10}
              cols={30}
              focused={focused.toString()}
              onBlur={handleFocus}
              pattern={"^[A-Za-z0-9!@#$%^&*()]{1,500}$"}
              disabled={showForm}
            />
          </div>
        </div>
        <div className="info-text">
          <span className="add-request-info">
            Please make sure you fill the profile and form requirements
          </span>

          <span className="add-request-info">
            for accurate validation and fast approval
          </span>
        </div>

        <div className="hd-btn-container">
          <button className="tor-btn">Submit</button>

          <button className="tor-btn CANCEL" onClick={backToHomePage}>
            Cancel
          </button>
        </div>
      </form>
    </Box>
  );
}

export default HD;
