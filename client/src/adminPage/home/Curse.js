import React, { useContext, useEffect } from "react";
import "./home.css";
import SideBar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";
import { AuthContext } from "../../clientPage/components/context/authContext";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Home() {
  const site = useLocation();
  const DATA = [
    {
      id: 1,
      link: "/admin/requests",
      title: "REQUISITION OF DOCUMENTS",
    },
    {
      id: 2,
      link: "/admin/request/wdf",
      title: "WITHDRAWAL FORM",
    },
    {
      id: 3,
      link: "/admin/request/hd",
      title: "HONORABLE DISMISSAL",
    },
  ];
  const myFunction = async () => {
    try {
      const res = await axios.put(
        "http://localhost:3001/api/admin/request/approveHdRequest"
      );
      console.log(res.data);
      console.log("check");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      myFunction();
    };

    fetchData();
  }, [site, myFunction()]);

  const { adminLogout } = useContext(AuthContext);
  return (
    <div className="admin-home-container">
      <SideBar
        myProps1="/admin/dashboard/allrequest"
        myProps2="/admin/home"
        myProps6="/admin/login"
        DATA={DATA}
        myProps7={adminLogout}
      />

      <div className="admin-home-wrapper">
        <Navbar />
      </div>
      <div>asdasd</div>
    </div>
  );
}

export default Home;
