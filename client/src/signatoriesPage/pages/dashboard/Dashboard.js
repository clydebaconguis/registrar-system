import React, { useContext, useEffect, useState } from "react";
import "./dashboard.css";
import Sidebar from "../../../adminPage/components/sidebar/Sidebar";
import Navbar from "../../../adminPage/components/navbar/Navbar";
import Widget from "../../../adminPage/components/widgets/Widget";
import Chart from "../../../adminPage/components/chart/Chart";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../clientPage/components/context/authContext";
import axios from "axios";
export let filterID;
function Dashboard() {
  const [tor, setTor] = useState(0);
  const [hd, setHd] = useState(0);
  const [wf, setWf] = useState(0);
  const [yearlyData, setYearlyData] = useState([{}]);
  const [monthlyData, setMonthlyData] = useState("");
  const [dailyData, setDailyData] = useState("");
  const { signatoriesLogout } = useContext(AuthContext);
  const Data = [
    {
      id: 1,
      title: "REQUISITION OF DOCUMENTS",
      totalAmount: tor,
      newData: 2,
      link: "/signatories/requests/cfrd",
      linkTitle: "See all Transcript of Records",
    },
    {
      id: 2,
      title: "WITHDRAWAL FORM",
      totalAmount: wf,
      newData: 2,
      link: "/signatories/request/wdf",
      linkTitle: "See all Withdrawal Form",
    },
    {
      id: 3,
      title: "HONORABLE DISMISSAL",
      totalAmount: hd,
      newData: 2,
      link: "/signatories/request/hd",
      linkTitle: "See all Honorable Dissmisal",
    },
  ];

  const site = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/signatories/status/getTotalRequests"
        );

        setTor(res.data[0] ? res.data[0] : "0");
        setHd(res.data[1] ? res.data[1] : "0");
      } catch (err) {
        console.log(err);
        navigate("/admin/login");
      }
    };

    fetchData();
  }, [site]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/signatories/status/requests/data"
        );
        // console.log(res.data);
        setYearlyData(res.data[2]);
        setDailyData(res.data[0]);
        setMonthlyData(res.data[1]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [site]);

  const [yearlyChart, setYearlyChart] = [
    {
      labels: yearlyData && yearlyData.map((data) => `${data.year}`),
      datasets: [
        {
          label: "",
          data: yearlyData && yearlyData.map((data) => data.total_requests),
          backgroundColor: [" #c1b019", "#0f5132", "#842029"],
        },
      ],
    },
  ];
  const [dailyDataChart, setdailyDataCHart] = [
    {
      labels:
        dailyData &&
        dailyData.map((data) => `${data.date}/${data.day}/${data.year} `),
      datasets: [
        {
          label: "",
          data: dailyData && dailyData.map((data) => data.total_requests),
          backgroundColor: [" #c1b019", "#0f5132", "#842029"],
        },
      ],
    },
  ];

  const [monthlyChart, setMonthlyCHart] = [
    {
      labels:
        monthlyData && monthlyData.map((data) => `${data.date} ${data.year}`),
      datasets: [
        {
          label: "",
          data: monthlyData && monthlyData.map((data) => data.total_requests),
          backgroundColor: [" #c1b019", "#0f5132", "#842029"],
        },
      ],
    },
  ];

  const filteredData = Data.filter((data) => data.totalAmount > 0);
  filterID = Data.filter((data) => data.totalAmount > 0);
  const data = [
    {
      id: 1,
      link: "/signatories/requests/cfrd",
      title: "REQUISITION OF DOCUMENTS",
    },
    {
      id: 2,
      link: "/signatories/request/wdf",
      title: "WITHDRAWAL FORM",
    },
    {
      id: 3,
      link: "/signatories/request/hd",
      title: "HONORABLE DISMISSAL",
    },
  ];

  const idsTofind = [];
  const filterLink = [];
  if (filteredData.length > 0) {
    for (let i = 0; i < filteredData.length; i++) {
      idsTofind.push(filteredData[i].id);
    }

    for (let i = 0; i < idsTofind.length; i++) {
      const link = data.find((item) => item.id === idsTofind[i]); // find the corresponding link from data array using the id
      if (link) {
        filterLink.push(link); // add the link to the filterLinks array if it exists
      }
    }
  }

  return (
    <div className="dashboard-home">
      <Sidebar
        myProps1="/signatories/dashboards"
        myProps2="/signatories/home"
        myProps6="/admin/login"
        DATA={filterLink}
        myProps7={signatoriesLogout}
      />
      <div className="dashboard-home-container">
        <Navbar classNam="dashboard-navbar" />

        <div className="dashboard-home-widgets">
          <div>
            <h1>DASHBOARD</h1>
          </div>
          <div className="dashboard-widgets">
            {filteredData.map((data) => (
              <Widget key={data.id} {...data} />
            ))}
          </div>
        </div>
        <div className="dashboard-home-top-chart">
          <div className="dashboard-chart-yearly">
            <h2>Yearly Request</h2>
            <Chart className="dashboard-Chart" chartData={yearlyChart} />
          </div>
          <div className="dashboard-chart-monthly">
            <h2>Monthly Request</h2>
            <Chart className="dashboard-Chart" chartData={monthlyChart} />
          </div>
        </div>
        <div className="dashboard-home-bottom-chart">
          <div className="dashboard-chart-monthly">
            <h2>Daily Request</h2>
            <Chart className="dashboard-Chart" chartData={dailyDataChart} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
