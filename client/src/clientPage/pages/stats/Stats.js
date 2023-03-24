import React, { useContext, useEffect, useState } from "react";
import "./stats.css";
import { MdPendingActions } from "react-icons/md";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { GoUnverified } from "react-icons/go";
// import { sampleData } from "../../ChartData";
import Chart from "../../components/charts/Chart";
import { AuthContext } from "../../components/context/authContext";
import Widget from "../../components/widgets/Widget";
import { axiosInstance } from "../../config";

import axios from "axios";
import SoloPage from "../../components/solopage/SoloPage";
// import { useLocation } from "react-router-dom";

export default function Stats() {
  const { currentUser } = useContext(AuthContext);
  const [pending, setPending] = useState(0);
  const [approve, setApproved] = useState(0);
  const [validating, setValidating] = useState(0);
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState("");
  // const site = useLocation();
  const [decline, setDecline] = useState(0);

  const Stats = [
    {
      id: 1,
      title: "Validating...",
      cName: "stats-text-pending",
      iconContainerClassName: "stats-icon-validating",
      iconClassName: "stats-validating",
      icon: <GoUnverified />,
      amount: validating,
    },
    {
      id: 2,
      title: "Pending...",
      cName: "stats-text-pending",
      iconContainerClassName: "stats-icon-pending",
      iconClassName: "stats-pending",
      icon: <MdPendingActions />,
      amount: pending,
    },
    {
      id: 3,
      title: "Approve",
      cName: "stats-text-approve",
      iconContainerClassName: "stats-icon-approve",
      iconClassName: "stats-approve",
      icon: <BsFillCalendarCheckFill />,
      amount: approve,
    },
    {
      id: 4,
      title: "Declined",
      cName: "stats-text-decline",
      iconContainerClassName: "stats-icon-decline",
      iconClassName: "stats-decline",
      icon: <FaTrashAlt />,
      amount: decline,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          "/status/pending",
          {
            userID: currentUser?.User_ID || 0,
          }
        );
        setAllData(res.data);
      } catch (err) {
        console.log(err);
      }

      try {
        const res = await axiosInstance.post(
          "/status/months",
          {
            userID: currentUser.User_ID,
          }
        );
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    const fetchData = () => {
      const pendingData = allData.filter((item) => item.note === "PENDING");
      setPending(pendingData.map((item) => item.total_requests));
      const approvedData = allData.filter((item) => item.note === "APPROVED");
      setApproved(approvedData.map((item) => item.total_requests));
      const declinedData = allData.filter((item) => item.note === "DECLINED");
      setDecline(declinedData.total_requests);
      const validating = allData.filter((item) => item.note === "VALIDATING");
      setValidating(validating.map((item) => item.total_requests));
    };

    fetchData();
  }, [allData]);

  return (
    <>
      <div className="stats-main-container">
        <div className="stats-widgets">
          {Stats.map((stats) => (
            <Widget className="widgets" key={stats.id} {...stats} />
          ))}
        </div>
      </div>
    </>
  );
}
