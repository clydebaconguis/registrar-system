import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { FaUser, FaDiscourse } from "react-icons/fa";
import { FcDepartment } from "react-icons/fc";
import { AiOutlineUser } from "react-icons/ai";
import CreateSignatories from "../../components/createSignatories/CreateSignatories";
import CreateStaff from "../../components/createStaff/CreateStaff";
import axios from "axios";
import "./profile.css";
import { useNavigate } from "react-router-dom";
function Profile() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [adminRole, setAdminRole] = useState([]);
  const [adminRoles, setAdminRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showCreateSignatory, setShowCreateSignatory] = useState(false);
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/superadmin/request/getAdminRoleAndDepartments"
        );
        setData(res.data);
        setAdminRole(res.data[0]);
        setDepartments(res.data[1]);
      } catch (err) {
        console.log(err);
        navigate("/superadmin/login");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = () => {
      const role = adminRole.filter(
        (data) =>
          data.description !== "SUPER_ADMIN" &&
          data.description !== "REGISTRAR STAFF"
      );
      setAdminRoles(role);
    };

    fetchData();
  }, [data]);

  const submitRequestSignatory = async (values) => {
    const filteredRole = adminRole.filter(
      (item) => item.description === values.signatoriesRole
    );
    const filteredDepartent = departments.filter(
      (item) => item.description === values.department
    );
    const signatoriesRole = filteredRole.map((item) => item.id);
    const department = filteredDepartent.map((item) => item.id);
    values.signatoriesRole = signatoriesRole[0];
    values.department = department[0];
    try {
      const res = await axios.post(
        `http://localhost:3001/api/superadmin/auth/registerAccount`,
        {
          values,
        }
      );
      console.log(res.data);
      alert(res.data);
      window.location.href = "/superadmin/profile";
    } catch (error) {
      console.log(error);
    }
  };

  const submitRequestStaff = async (values) => {
    const filteredDepartent = departments.filter(
      (item) => item.description === values.department
    );

    const department = filteredDepartent.map((item) => item.id);
    values.signatoriesRole = 10;
    values.department = department[0];

    try {
      const res = await axios.post(
        `http://localhost:3001/api/superadmin/auth/registerAccount`,
        {
          values,
        }
      );
      console.log(res.data);
      alert(res.data);
      window.location.href = "/superadmin/profile";
    } catch (error) {
      console.log(error);
      alert(error.response.data);
    }
  };

  const showcreateSignatory = () => {
    setShowCreateSignatory(true);
    setShowCreateStaff(false);
  };

  const showcreateStaff = () => {
    setShowCreateStaff(true);
    setShowCreateSignatory(false);
  };
  return (
    <div className="admin-home-container">
      <Sidebar />

      <div className="admin-home-wrapper">
        <Navbar />
        <div className="user-profile-top">
          <div className="user-profile-top-left">
            <div className="user-profile-top-first">
              <span
                className={`user-profile-link ${
                  showCreateSignatory ? ` ACTIVE` : ""
                }`}
                onClick={() => {
                  showcreateSignatory();
                }}
              >
                <AiOutlineUser className="user-icon" />
                CREATE SIGNATORIES USERS
              </span>
              <span
                className={`user-profile-link ${
                  showCreateStaff ? ` ACTIVE` : ""
                }`}
                onClick={showcreateStaff}
              >
                <FaUser className="user-icon" />
                CREATE STAFF USERS
              </span>
              <span className="user-profile-link">
                <FaDiscourse className="user-icon" />
                ADD COURSES
              </span>
              <span className="user-profile-link">
                <FcDepartment className="user-icon" />
                ADD DEPARTMENT
              </span>
            </div>
          </div>
          <div className="user-profile-top-right">
            <div className="user-profile-top-right-first">
              {showCreateSignatory && (
                <CreateSignatories
                  adminRole={adminRoles}
                  departments={departments}
                  onClick={submitRequestSignatory}
                />
              )}
              {showCreateStaff && (
                <CreateStaff
                  departments={departments}
                  onClick={submitRequestStaff}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
