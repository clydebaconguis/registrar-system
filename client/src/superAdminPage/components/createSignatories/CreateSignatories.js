import React, { useEffect, useState } from "react";
import "./createsignatories.css";
import RegisterInput from "../../../clientPage/components/elements/registerInput";
import FormSelectInputs from "../elements/FormtSelectInputs";

function CreateSignatories({ adminRole, departments, onClick }) {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    middlename: "",
    department: "",
    document: "",
    signatoriesRole: "",
  });
  const [adminRoleOptions, setAdminRoleOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const handleInputChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchData = () => {
      if (values.document === "REQUISITION OF DOCUMENTS") {
        const adminRoleS = adminRole.filter(
          (data) =>
            data.description === "DEAN" ||
            data.description === "LIBRARY" ||
            data.description === "COMPTROLLER" ||
            data.description === "CSDL"
        );
        setAdminRoleOptions(adminRoleS);
        if (values.signatoriesRole === "LIBRARY") {
          const option = departments.filter(
            (data) => data.description === "LIBRARY DEPARTMENT"
          );
          setDepartmentOptions(option);
        }
        if (values.signatoriesRole === "COMPTROLLER") {
          const option = departments.filter(
            (data) => data.description === "COMPTROLLER'S DEPARTMENT"
          );
          setDepartmentOptions(option);
        }
        if (values.signatoriesRole === "CSDL") {
          const option = departments.filter(
            (data) => data.description === "Student Development and. Leadership"
          );
          setDepartmentOptions(option);
        }
        if (values.signatoriesRole === "DEAN") {
          const option = departments.filter(
            (data) =>
              data.description !== "Guidance Office" &&
              data.description !== "Student Development and. Leadership" &&
              data.description !== "REGISTRAR DEPARTMENT" &&
              data.description !== "CASHIER" &&
              data.description !== "LIBRARY" &&
              data.description !== "REGISTRAR DEPARTMENT" &&
              data.description !== "FINANCE DEPARTMENT" &&
              data.description !== "CASHIER" &&
              data.description !== "COMPTROLLER'S DEPARTMENT" &&
              data.description !== "LIBRARY DEPARTMENT"
          );
          setDepartmentOptions(option);
        }
      } else {
        const adminRoleS = adminRole.filter(
          (data) =>
            data.description === "DEAN" ||
            data.description === "GUIDANCE" ||
            data.description === "COMPTROLLER" ||
            data.description === "CSDL" ||
            data.description === "PROGRAM HEAD" ||
            data.description === "REGISTRAR"
        );
        setAdminRoleOptions(adminRoleS);

        if (values.signatoriesRole === "COMPTROLLER") {
          const option = departments.filter(
            (data) => data.description === "COMPTROLLER'S DEPARTMENT"
          );
          setDepartmentOptions(option);
        }
        if (values.signatoriesRole === "CSDL") {
          const option = departments.filter(
            (data) => data.description === "Student Development and. Leadership"
          );
          setDepartmentOptions(option);
        }
        if (values.signatoriesRole === "REGISTRAR") {
          const option = departments.filter(
            (data) => data.description === "REGISTRAR DEPARTMENT"
          );
          setDepartmentOptions(option);
        }
        if (values.signatoriesRole === "GUIDANCE") {
          const option = departments.filter(
            (data) => data.description === "Guidance Office"
          );
          setDepartmentOptions(option);
        }
        if (
          values.signatoriesRole === "PROGRAM HEAD" ||
          values.signatoriesRole === "DEAN"
        ) {
          const option = departments.filter(
            (data) =>
              data.description !== "Guidance Office" &&
              data.description !== "Student Development and. Leadership" &&
              data.description !== "REGISTRAR DEPARTMENT" &&
              data.description !== "CASHIER" &&
              data.description !== "LIBRARY" &&
              data.description !== "REGISTRAR DEPARTMENT" &&
              data.description !== "FINANCE DEPARTMENT" &&
              data.description !== "CASHIER" &&
              data.description !== "COMPTROLLER'S DEPARTMENT" &&
              data.description !== "LIBRARY DEPARTMENT"
          );
          setDepartmentOptions(option);
        }
      }
    };

    fetchData();
  }, [values.document, values.signatoriesRole]);

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Enter Username",
      label: "Username",
      errorMessage:
        "Username should be 6 - 20 characters and no special characters!",
      pattern: "^[A-Za-z0-9]{6,20}$",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Enter Email",
      errorMessage: "It should be a valid email address!",
      label: "Email",
      required: true,
    },
    {
      id: 3,
      name: "password",
      type: "password",
      placeholder: "Enter Password",
      errorMessage: "Password should be 8 - 20 characters",
      pattern: "^[A-Za-z0-9]{6,20}$",
      label: "Password",
      required: true,
    },
    {
      id: 4,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Password don't match !",
      pattern: values.password,
      label: "Confirm Password",
      required: true,
    },
  ];

  const inputForProfile = [
    {
      id: 1,
      name: "firstname",
      type: "text",
      placeholder: "Enter First Name",
      label: "First Name",
      errorMessage: "please enter a valid username",
      pattern: "^[A-Za-z0-9 ]{2,20}$",
      required: true,
    },
    {
      id: 2,
      name: "lastname",
      type: "text",
      placeholder: "Enter Last Name",
      label: "Last Name",
      errorMessage: "please enter you last name",
      pattern: "^[A-Za-z0-9 ]{2,20}$",
      required: true,
    },
    {
      id: 3,
      name: "middlename",
      type: "text",
      placeholder: "Enter Middle Name",
      errorMessage: "please enter your middle name",
      pattern: "^[A-Za-z0-9 ]{2,20}$",
      label: "Enter Middle Name",
      required: true,
    },
  ];

  const documentOption = [
    {
      id: 1,
      description: "REQUISITION OF DOCUMENTS",
    },
    {
      id: 2,
      description: "HONORABLE DISMISSAL",
    },
  ];
  const formselectinputs = [
    {
      id: 1,
      type: "select",
      name: "document",
      placeholder: "Select Document",
      label: "Documents",
      title: "Select Document",
      required: true,
      options: documentOption,
      // disabled: disable,
    },
    {
      id: 2,
      type: "select",
      name: "signatoriesRole",
      placeholder: "Select Signatories Role",
      label: "Signatory Roles",
      title: "Select Signatories Role",
      required: true,
      options: adminRoleOptions,
      // disabled: disable,
    },
    {
      id: 3,
      type: "select",
      name: "department",
      placeholder: "Select Department",
      label: "Departments",
      title: "Select Department",

      required: true,

      options: departmentOptions,
      // disabled: disable,
    },
  ];
  return (
    <form
      className="register-signatories-main"
      onSubmit={(e) => {
        onClick(values);
        e.preventDefault()
      }}
    >
      <div className="register-signatories-top">
        <span className="registers-signatories-title">
          INPUT SIGNATORIES USER ACCOUNT DETAILS
        </span>
        <div className="register-signatories-top-second">
          {inputs.map((input) => (
            <RegisterInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={handleInputChange}
            />
          ))}
        </div>
        <div className="register-signatories-top-second">
          {inputForProfile.map((input) => (
            <RegisterInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={handleInputChange}
            />
          ))}
        </div>
        <div className="register-signatories-top-second">
          {formselectinputs.map((input) => (
            <FormSelectInputs
              {...input}
              value={values[input.name]}
              onChange={handleInputChange}
              key={input.id}
            />
          ))}
        </div>
      </div>
      <div className="register-signatories-bottom">
        <button className="registerr-sigatories-btn">SUBMIT</button>
      </div>
    </form>
  );
}

export default CreateSignatories;
