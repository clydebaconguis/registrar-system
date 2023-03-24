import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import "./wdf.css";
import axios from "axios";
import SelectInputsHD from "../elements/SelectInputsHD";
import FormSelectInputs from "../elements/formselectinputs";
import { AuthContext } from "../context/authContext";
import FormInput from "../elements/forminput";
import { yearLevel, monthGraduated, semesters } from "../data";
import { useLocation } from "react-router-dom";
function WDF() {
  const { currentUser } = useContext(AuthContext);
  const [courseList, setCourseList] = useState([]);
  const [isGradute, setIsGraduate] = useState(false);
  const [isNotEnrolled, setIsNotEnrolled] = useState(false);
  const site = useLocation();
  let currentYear = new Date().getFullYear();
  const year = 100;
  const schoolYears = [];
  for (let i = 0; i < year; i++) {
    schoolYears.push(` ${currentYear - (i + 1)}-${currentYear - i} `);
  }

  const schoolYearGraduted = [];
  for (let i = 0; i < year; i++) {
    schoolYearGraduted.push(`${currentYear - i}`);
  }

  const [focused, setFocuse] = useState(false);
  const handleFocus = (e) => {
    setFocuse(true);
  };

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
    currentSemester: "",
    units: "",
    lastSchoolYear: "",
    studentRemarks: "",
    interviewerRemarks: "",
    semester: "",
  });

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
      type: "firstname",
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
    }
  };

  const handleInputChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const getCourseID = (course, courselist) => {
    for (let i = 0; i < courselist.length; i++) {
      if (course === courselist[i].Course_Description) {
        values.course = courselist[i].Course_ID;
      }
    }
  };
  const submitRequest = async (e) => {
    e.preventDefault();
    getCourseID(values.course, courseList);
    try {
      const res = await axios.post(
        "http://localhost:3001/api/request/addRequestWdf",
        values
      );
      console.log(res.data);
      setValues({
        semester: "",
        units: "",
        lastSchoolYear: "",
        studentRemarks: "",
        interviewerRemarks: "",
      });
      alert("request succesful");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Box className="wdf-main-container">
      <form className="wdf-top-container" onSubmit={submitRequest}>
        <div className="wdf-form-text">
          <h1> WITHDRAWAL FORM</h1>
        </div>
        <div className="wdf-top-inputs-container">
          {inputs.map((input) => (
            <div key={input.id} className="wdf-top-inputs">
              <FormInput
                {...input}
                value={values[input.name]}
                onChange={handleInputChange}
              />
            </div>
          ))}
        </div>
        <div className="wdf-top-inputs-container">
          {selectedInputs.map((input) => (
            <div key={input.id} className="wdf-top-inputs">
              <FormSelectInputs
                key={input.id}
                {...input}
                value={values[input.name]}
                onChange={handleInputChange}
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
              />
            </div>
          ))}
        </div>
        <div className="wdf-radio-button">
          <div className="wdf-select">
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
              />
              ENROLLED
            </label>
          </div>
          <div className="wdf-select">
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
              />
              NOT ENROLLED
            </label>
            {isNotEnrolled && (
              <div className="wdf-notenrolled">
                <label className="wdf-notenrolled-select-title">
                  Last school year attended:
                </label>
                <select
                  className="wdf-notenrolled-select"
                  name="currentSemester"
                  onChange={handleInputChange}
                  placeholder="SELECT SEMESTER"
                  value={values.currentSemester}
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
                  className="wdf-notenrolled-select"
                  name="lastSchoolYearAttended"
                  onChange={handleInputChange}
                  value={values.lastSchoolYearAttended}
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
          </div>
          <div className="wdf-select">
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
              />
              GRADUATED
            </label>
            {isGradute && (
              <div className="wdf-notenrolled">
                <select
                  className="wdf-notenrolled-select"
                  name="currentSemester"
                  onChange={handleInputChange}
                  placeholder="SELECT SEMESTER"
                  value={values.currentSemester}
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
                  className="wdf-notenrolled-select"
                  name="lastSchoolYearAttended"
                  onChange={handleInputChange}
                  value={values.lastSchoolYearAttended}
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
        <div className="wdf-top">
          <div>
            <span className="wdf-title">Request to withdraw this</span>
            <div className="wdf-top-inputs">
              {selectInputs.map((input) => (
                <SelectInputsHD
                  key={input.id}
                  {...input}
                  values={values[input.name]}
                  onChange={handleInputChange}
                />
              ))}
            </div>
          </div>
          <div className="wdf-top">
            <span className="wdf-title">
              Units enrolled & withdrawn:
              <input
                className="wdf-input"
                type="text"
                name="units"
                required={true}
                placeholder="Enter units"
                value={values.units}
                onChange={handleInputChange}
                focused={focused.toString()}
                onBlur={handleFocus}
                pattern={"^[0-9]{1,3}$"}
              />
            </span>
          </div>
        </div>
        <div className="wdf-bottom">
          <div className="wdf-text-area">
            <span className="wdf-title">Student Remarks:</span>
            <span className="wdf-input-text">
              Please specify reasons for requesting honorable dismissal.
            </span>

            <textarea
              name="studentRemarks"
              className="wdf-text"
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
            />
          </div>
          <div className="wdf-text-area">
            <span className="wdf-title">Interviewer Remarks:</span>
            <span className="wdf-input-text">
              Please detail on student's reason/s.
            </span>

            <textarea
              name="interviewerRemarks"
              className="wdf-text"
              value={values.interviewerRemarks}
              placeholder=" Reason 1: .....
              Reason 2: ....."
              onChange={handleInputChange}
              rows={10}
              cols={30}
              focused={focused.toString()}
              onBlur={handleFocus}
              pattern={"^[A-Za-z0-9!@#$%^&*()]{1,500}$"}
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
        <div className="wdf-btn-container">
          <button className="wdf-btn">Submit</button>
        </div>
      </form>
    </Box>
  );
}

export default WDF;
