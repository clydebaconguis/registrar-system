import React, { useContext, useEffect, useState } from "react";
import { yearLevel, monthGraduated, semesters } from "../data";

import "./studentprofile.css";
import { AuthContext } from "../context/authContext";
import SelectInputs from "../elements/formselectinputs";
import RegisterInput from "../elements/forminput";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Box } from "@mui/system";
import { CgProfile } from "react-icons/cg";

export default function StudentProfile() {
  const { currentUser } = useContext(AuthContext);
  const [courseList, setCourseList] = useState([]);
  const [disable, setDisable] = useState(true);
  const [isGradute, setIsGraduate] = useState(false);
  const [isNotEnrolled, setIsNotEnrolled] = useState(false);
  const site = useLocation();
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    schoolId: "",
    currentAddress: "",
    phoneNumber: "",
    course: "",
    yearlevel: "",
    enrollmentStatus: "",
    semester: "",
    lastSchoolYearAttended: "",
  });
  let currentYear = new Date().getFullYear();
  const year = 100;
  const yearGraduated = 100;
  const schoolYearGraduted = [];
  for (let i = 0; i < yearGraduated; i++) {
    schoolYearGraduted.push(`${currentYear - i}`);
  }

  const schoolYears = [];
  for (let i = 0; i < year; i++) {
    schoolYears.push(` ${currentYear - (i + 1)}-${currentYear - i} `);
  }

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
        semester: profiledata ? profiledata[0].semester : "",
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

  const submitStudent = async (e) => {
    e.preventDefault();
    getCourseID(values.course, courseList);
    if (!isNotEnrolled && !isGradute) {
      values.semester = "N/A";
      values.lastSchoolYearAttended = "N/A";
    }
    try {
      const res = await axios.post(
        "http://localhost:3001/api/request/addProfile",
        values
      );
      alert(res.data);
      disableInputs();
    } catch (err) {
      console.log(err);
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
      disabled: disable,
    },
    {
      id: 2,
      type: "firstname",
      name: "lastname",
      placeholder: "Enter Last Name",
      label: "Last Name",
      errorMessage:
        "Please enter your last name for fast validation and approval",
      pattern: "^[A-Za-z ]{1,40}$",
      required: true,
      disabled: disable,
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
      disabled: disable,
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

      disabled: disable,
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
      disabled: disable,
    },
    {
      id: 7,
      type: "text",
      name: "currentAddress",
      placeholder: "Enter Current Address",
      label: "Current Address",
      errorMessage: "Please enter your current address",
      pattern: "^[A-Za-z0-9!@#$%^&*()_+ ]{1,40}$", // "^(?=.*[0-9])(?=.*[!@#$%^&*()]){1,50}$",
      required: true,
      disabled: disable,
    },
  ];

  const selectInputs = [
    {
      id: 1,
      type: "select",
      name: "course",
      placeholder: "Select Course",
      label: "Course(select)",
      title: "Select Course",
      required: true,
      options: courseList,
      disabled: disable,
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
      disabled: disable,
    },
  ];

  const disableInputs = () => {
    setDisable(!disable);
    getProfile();
  };

  const handleInputChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-main-container">
      <Box>
        <form onSubmit={submitStudent} className="profile-form">
          <div>
            <h1 className="profile-title">
              <CgProfile className="profile-icon" />
              <span>STUDENT'S PROFILE</span>
            </h1>
          </div>
          <div className="profile-first-container">
            <div className="profile-input-container">
              {inputs.map((input) => (
                <RegisterInput
                  key={input.id}
                  {...input}
                  value={values[input.name]}
                  onChange={handleInputChange}
                />
              ))}
            </div>
            <div className="profile-input-container">
              {selectInputs.map((input) => (
                <SelectInputs
                  key={input.id}
                  {...input}
                  value={values[input.name]}
                  onChange={handleInputChange}
                />
              ))}
            </div>
            <div className="profile-radio-button">
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
                  disabled={disable}
                />
                ENROLLED
              </label>
              <label>
                <input
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
                  disabled={disable}
                />
                NOT ENROLLED
              </label>
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
                  checked={isGradute ? true : false}
                  disabled={disable}
                />
                GRADUATED
              </label>
              {isNotEnrolled && (
                <div className="profile-notenrolled">
                  <label>Last school year attended:</label>
                  <select
                    className="profile-notenrolled-select"
                    name="semester"
                    onChange={handleInputChange}
                    placeholder="SELECT SEMESTER"
                    value={values.semester}
                    disabled={disable}
                    required={isNotEnrolled}
                  >
                    <option value="">SELECT SEMESTER</option>
                    {semesters.map((semester) => (
                      <option value={semester} key={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>
                  <select
                    className="profile-notenrolled-select"
                    name="lastSchoolYearAttended"
                    onChange={handleInputChange}
                    value={values.lastSchoolYearAttended}
                    disabled={disable}
                    required={isNotEnrolled}
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
              {isGradute && (
                <div className="profile-notenrolled">
                  <select
                    className="profile-notenrolled-select"
                    name="semester"
                    onChange={handleInputChange}
                    placeholder="SELECT SEMESTER"
                    value={values.semester}
                    disabled={disable}
                    required={isGradute}
                  >
                    <option value="">MONTH GRADUATED</option>
                    {monthGraduated.map((month) => (
                      <option value={month.description} key={month.id}>
                        {month.description}
                      </option>
                    ))}
                  </select>
                  <select
                    className="profile-notenrolled-select"
                    name="lastSchoolYearAttended"
                    onChange={handleInputChange}
                    value={values.lastSchoolYearAttended}
                    disabled={disable}
                    required={isGradute}
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
          <div className="profile-btn-main-container">
            {!disable ? (
              <div className="profile-btn-container">
                <button className="profile-btn">submit</button>
                <button className="profile-btn" onClick={disableInputs}>
                  c a n c e l
                </button>
              </div>
            ) : (
              <button className="profile-btn" onClick={disableInputs}>
                EDIT PROFILE
              </button>
            )}
          </div>
        </form>
      </Box>
      {/* <Box className="profile-form">
        <div>
          <h1 className="profile-title">
            <FaUserCircle className="profile-icon" />
            <span>USERS'S PROFILE</span>
          </h1>
        </div>
        <Userprofile />
      </Box> */}
    </div>
  );
}
