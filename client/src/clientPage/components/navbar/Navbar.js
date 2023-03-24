import { React, useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdOutlineDocumentScanner } from "react-icons/md";

import Logo from "../images/logo.png";
import { AuthContext } from "../context/authContext";

import "./navbar.css";

export default function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const SidebarData = [
    {
      title: "Home Page",
      path: "/homepage",
      icon: <MdOutlineDocumentScanner />,
      cName: "nav-text",
    },
    {
      title: "Profile",
      path: `/profile/${currentUser ? currentUser.User_ID : 0}`,
      icon: <CgProfile />,
      cName: "nav-text",
    },
  ];

  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <div className="sidebar-main-container">
      <div className="navbar-container">
        <div className="navbar-second-container">
          <div className="navbar-first-container">
            <Link to="#" className="menu-bars">
              {sidebar ? "" : <FaBars onClick={showSidebar} />}
            </Link>
          </div>

          <div>
            <img className="navbar-logo" src={Logo} alt="" />
          </div>
          <div className="navbar-first-container"> </div>
        </div>
      </div>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items">
          {sidebar ? (
            <div className="navbar-first-container">
              <Link to="#" className="menu-bars">
                <AiOutlineClose onClick={showSidebar} />
              </Link>
            </div>
          ) : (
            ""
          )}
          {SidebarData.map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <NavLink
                  to={item.path}
                  onClick={showSidebar}
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                >
                  {item.icon}
                  <span className="nav-span">{item.title}</span>
                </NavLink>
              </li>
            );
          })}
          <li className="nav-text">
            <NavLink
              to="/"
              onClick={logout}
              className={({ isActive }) =>
                "nav-links" + (isActive ? " activated" : "")
              }
            >
              <RiLogoutBoxLine />
              <span className="nav-span" onClick={logout}>
                Logout
              </span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
