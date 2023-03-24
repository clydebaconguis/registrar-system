import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../clientPage/components/context/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import "./dashboard.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../../adminPage/components/widgets/Widget";
import Chart from "../../../adminPage/components/chart/Chart";
import DataTable from "../../components/DataTable/DataTable";
import axios from "axios";

function Dashboard() {
  const { adminLogout } = useContext(AuthContext);
  const [tor, setTor] = useState([]);
  const [hd, setHd] = useState([]);
  const [yearlyData, setYearlyData] = useState([{}]);
  const [monthlyData, setMonthlyData] = useState([{}]);
  const [dailyData, setDailyData] = useState([{}]);

  const [yearlyDataCfrd, setYearlyDataCfrd] = useState([{}]);
  const [monthlyDataCfrd, setMonthlyDataCfrd] = useState([{}]);
  const [dailyDataCfrd, setDailyDataCfrd] = useState([{}]);

  const [yearlyDataHd, setYearlyDataHd] = useState([{}]);
  const [monthlyDataHd, setMonthlyDataHd] = useState([{}]);
  const [dailyDataHd, setDailyDataHd] = useState([{}]);

  const [title, setTitle] = useState("");
  const [allData, setAllData] = useState([]);
  const site = useLocation();

  const Data = [
    {
      id: 1,
      title: "Requisition of Documents",
      totalAmount: tor,
      newData: 2,
      link: "/superadmin/requests/cfrd",
      linkTitle: "See all Requisition of Documents",
    },
    {
      id: 2,
      title: "HONORABLE DISMISSAL",
      totalAmount: hd,
      newData: 2,
      link: "/superadmin/requests/hd",
      linkTitle: "See all Honorable Dissmisal",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/superadmin/status/getTotalRequests"
        );
        setTor(res.data.totalForCfrd);
        setHd(res.data.totalForHd);
        const res1 = await axios.get(
          "http://localhost:3001/api/superadmin/status/getAllAdminUser"
        );
        setAllData(res1.data);
      } catch (err) {
        console.log(err);
        navigate("/superadmin/login");
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/superadmin/status/requests/data"
        );
        setYearlyData(res.data[2]);
        setDailyData(res.data[0]);
        setMonthlyData(res.data[1]);

        const res1 = await axios.get(
          "http://localhost:3001/api/superadmin/status/requests/data/perDocument"
        );

        setDailyDataCfrd(res1.data[0]);
        setMonthlyDataCfrd(res1.data[1]);
        setYearlyDataCfrd(res1.data[2]);
        setDailyDataHd(res1.data[3]);
        setMonthlyDataHd(res1.data[4]);
        setYearlyDataHd(res1.data[5]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [site]);

  const navigate = useNavigate();

  const allDates = [
    ...new Set(
      dailyData.map((data) => `${data.date} ${data.day}, ${data.year}`)
    ),
  ];
  const allRequestOfDocument1WithZeros = allDates.map((date) => {
    const matchingData = dailyDataCfrd.find(
      (data) => `${data.date} ${data.day}, ${data.year}` === date
    );
    return matchingData ? matchingData.total_requests : 0;
  });

  const allRequestOfDocument2WithZeros = allDates.map((date) => {
    const matchingData = dailyDataHd.find(
      (data) => `${data.date} ${data.day}, ${data.year}` === date
    );
    return matchingData ? matchingData.total_requests : 0;
  });

  const [dailyDataChart, setdailyDataCHart] = [
    {
      labels: allDates,

      datasets: [
        {
          label: "ALL",
          data: dailyData.map((data) => data.total_requests),
          backgroundColor: ["#c1b019"],
        },
        {
          label: "CFRD",
          data: allRequestOfDocument1WithZeros,

          backgroundColor: ["#0f5132"],
        },
        {
          label: "HD",
          data: allRequestOfDocument2WithZeros,

          backgroundColor: ["#842029"],
        },
      ],
    },
  ];

  const yearlyDates = [...new Set(yearlyData.map((data) => `${data.year}`))];

  const yearlyRequestOfDocument1WithZeros = yearlyDates.map((date) => {
    const matchingData = yearlyDataCfrd.find((data) => `${data.year}` === date);
    return matchingData ? matchingData.total_requests : 0;
  });
  const yearlyRequestOfDocument2WithZeros = yearlyDates.map((date) => {
    const matchingData = yearlyDataHd.find((data) => `${data.year}` === date);
    return matchingData ? matchingData.total_requests : 0;
  });
  const [yearlyChart, setYearlyChart] = [
    {
      labels: yearlyDates,
      datasets: [
        {
          label: "ALL",
          data: yearlyData && yearlyData.map((data) => data.total_requests),
          backgroundColor: ["#c1b019"],
        },
        {
          label: "CFRD",
          data: yearlyRequestOfDocument1WithZeros,
          backgroundColor: ["#0f5132"],
        },
        {
          label: "HD",
          data: yearlyRequestOfDocument2WithZeros,
          backgroundColor: ["#842029"],
        },
      ],
    },
  ];

  const monthlyDates = [
    ...new Set(dailyData.map((data) => `${data.date}, ${data.year}`)),
  ];
  const monthlyRequestOfDocument1WithZeros = monthlyDates.map((date) => {
    const matchingData = monthlyDataCfrd.find(
      (data) => `${data.date}, ${data.year}` === date
    );
    return matchingData ? matchingData.total_requests : 0;
  });

  const monthlyRequestOfDocument2WithZeros = monthlyDates.map((date) => {
    const matchingData = monthlyDataHd.find(
      (data) => `${data.date}, ${data.year}` === date
    );
    return matchingData ? matchingData.total_requests : 0;
  });

  const [monthlyChart, setMonthlyCHart] = [
    {
      labels: monthlyDates,
      datasets: [
        {
          label: "ALL",
          data: monthlyData && monthlyData.map((data) => data.total_requests),
          backgroundColor: [" #c1b019"],
        },
        {
          label: "CFRD",
          data: monthlyRequestOfDocument1WithZeros,
          backgroundColor: ["#0f5132"],
        },
        {
          label: "HD",
          data: monthlyRequestOfDocument2WithZeros,
          backgroundColor: ["#842029"],
        },
      ],
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 200,
      renderCell: (params) => {
        const name = `${params.row.fname} ${params.row.lname} ${params.row.mname}`;
        return (
          <div className="tableAction">
            <div className="columnView">VIEW</div>
            <div className="columnApprove">EDIT</div>
            <div className="columnDecline">DELETE</div>
          </div>
        );
      },
    },
  ];

  const data = [
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

  const link = [
    {
      link: "/admin/dashboard/allrequest",
    },
    {
      link: "/admin/home",
    },
    {
      link: "/admin/login",
    },
  ];
  return (
    <div className="super-admin-dashboard-home">
      <Sidebar />
      <div className="super-admin-dashboard-home-container">
        <Navbar classNam="super-admin-dashboard-navbar" />
        <div className="super-admin-dashboard-home-top">
          <div className="super-admin-dashboard-top-first">
            <div className="super-admin-dashboard-home-widgets">
              <div>
                <h1>DASHBOARD</h1>
              </div>
              <div className="super-admin-dashboard-widgets">
                {Data.map((data) => (
                  <Widget key={data.id} {...data} />
                ))}
              </div>
            </div>
            <div className="super-admin-dashboard-home-top-chart">
              <div className="super-admin-dashboard-chart-yearly">
                <h2>Yearly Request</h2>
                <Chart
                  className="super-admin-dashboard-Chart"
                  chartData={yearlyChart}
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                    color: "black",
                  }}
                />
              </div>
              <div className="super-admin-dashboard-chart-monthly">
                <h2>Monthly Request</h2>
                <Chart
                  className="super-admin-dashboard-Chart"
                  chartData={monthlyChart}
                />
              </div>
            </div>
            <div className="super-admin-dashboard-home-top-chart">
              <div className="super-admin-dashboard-chart-monthly">
                <h2>Daily Request</h2>
                <Chart
                  className="super-admin-dashboard-Chart"
                  chartData={dailyDataChart}
                />
              </div>
            </div>
          </div>
          <div className="super-admin-dashboard-home-middle">
            <div className="super-admin-admin-request-table">
              <span className="super-admin-text">
                ALL ADMIN AND SIGNATORY USERS
              </span>
              <DataTable
                props={allData}
                title={title}
                actionColumn={actionColumn}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
