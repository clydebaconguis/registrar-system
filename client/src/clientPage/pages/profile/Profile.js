import React from "react";
import "./profile.css";
import { Box } from "@mui/system";
import { FaUserCircle } from "react-icons/fa";
import Userprofile from "../../components/userprofile/Userprofile";
import StudentProfile from "../../components/studentProfile/StudentProfile";
export default function Profile() {
  return (
    <div className="profile-container">
      <Box className="profile-main-form">
        <StudentProfile />
      </Box>
      <Box className="profile-main-form">
        <div>
          <h1 className="profile-title">
            <FaUserCircle className="profile-icon" />
            <span>USER'S PROFILE</span>
          </h1>
        </div>
        <Userprofile />
      </Box>
    </div>
  );
}
