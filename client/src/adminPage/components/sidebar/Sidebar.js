import React, { useState, useContext } from "react";
import "./sidebar.css";
import Logo from "../../../clientPage/pages/images/logo.png";
import { Link, NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdOutlinePendingActions,
  MdAdminPanelSettings,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { RiArrowUpSLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";
import { SiReadthedocs } from "react-icons/si";
import { AuthContext } from "../../../clientPage/components/context/authContext";

const toRequests = () => {
  window.location.href = "/admin/requests";
};

function Sidebar(props) {
  const [showList, setShowList] = useState(false);
  const [showRequests, setShowRequest] = useState(false);
  const { adminLogout } = useContext(AuthContext);
  return (
    <div className="sidebar-container">
      <div className="sidebar-top">
        <img className="sidebar-logo" src={Logo} />
      </div>
      <hr />
      <div className="sidebar-center">
        <ul className="sidebar-ul">
          <NavLink to={props.myProps1} className="sidebar-link">
            <li className="sidebar-li">
              <MdDashboard className="sidebar-icon" />
              DASHBOARD
            </li>
          </NavLink>
          <NavLink to={props.myProps2} className="sidebar-link">
            <li className="sidebar-li">
              <FaHome className="sidebar-icon" />
              HOME
            </li>
          </NavLink>

          <li
            className="sidebar-li"
            onClick={() => {
              setShowRequest(!showRequests);
            }}
          >
            <MdOutlinePendingActions className="sidebar-icon" />
            REQUESTS
            {showRequests ? (
              <RiArrowUpSLine className="sidebar-icon" />
            ) : (
              <MdOutlineKeyboardArrowDown className="sidebar-icon" />
            )}
          </li>

          {showRequests && (
            <>
              {props.DATA.map((data) => (
                <li className="sidebar-li-profile" key={data.id}>
                  <SiReadthedocs className="sidebar-icon" />
                  <NavLink to={data.link} className="sidebar-link">
                    {data.title}
                  </NavLink>
                </li>
              ))}
            </>
          )}
          <li className="sidebar-li" onClick={(e) => setShowList(!showList)}>
            <ImProfile className="sidebar-icon" />
            <span className="sidebar-link"> PROFILE</span>
            {showList ? (
              <RiArrowUpSLine className="sidebar-icon" />
            ) : (
              <MdOutlineKeyboardArrowDown className="sidebar-icon" />
            )}
          </li>
          {showList && (
            <>
              <li className="sidebar-li-profile">
                <MdAdminPanelSettings className="sidebar-icon" />
                <NavLink className="sidebar-link" onClick={toRequests}>
                  ADMIN PROFILE
                </NavLink>
              </li>

              <li className="sidebar-li-profile">
                <CgProfile className="sidebar-icon" />
                <NavLink className="sidebar-link">USER PROFILE</NavLink>
              </li>
            </>
          )}
          <span className="sidebar-link" onClick={adminLogout}>
            <li className="sidebar-li">
              <BiLogOut className="sidebar-icon" />
              LOGOUT
            </li>
          </span>
        </ul>
      </div>
      <div className="sidenar-bottom">bottom</div>
    </div>
  );
}

export default Sidebar;
