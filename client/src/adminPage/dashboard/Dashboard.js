import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../clientPage/components/context/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import "./dashboard.css";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";
import Widget from "../components/widgets/Widget";
import Chart from "../components/chart/Chart";
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
  const site = useLocation();

  const Data = [
    {
      id: 1,
      title: "Requisition of Documents",
      totalAmount: tor,
      newData: 2,
      link: "/admin/requests",
      linkTitle: "See all Requisition of Documents",
    },
    {
      id: 2,
      title: "HONORABLE DISMISSAL",
      totalAmount: hd,
      newData: 2,
      link: "/admin/request/hd",
      linkTitle: "See all Honorable Dissmisal",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/admin/status/getTotalRequests"
        );
        setTor(res.data.totalForCfrd);
        setHd(res.data.totalForHd);
      } catch (err) {
        console.log(err);
        navigate("/admin/login");
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/admin/status/requests/data"
        );
        setYearlyData(res.data[2]);
        setDailyData(res.data[0]);
        setMonthlyData(res.data[1]);

        const res1 = await axios.get(
          "http://localhost:3001/api/admin/status/requests/data/perDocument"
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
          label: "Total Request Of All document this day",
          data: dailyData.map((data) => data.total_requests),
          backgroundColor: ["#c1b019"],
        },
        {
          label: "Total Request Of CFRD this day",
          data: allRequestOfDocument1WithZeros,

          backgroundColor: ["#0f5132"],
        },
        {
          label: "Total Request Of HD this day",
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
          label: "Total Request this Year",
          data: yearlyData && yearlyData.map((data) => data.total_requests),
          backgroundColor: ["#c1b019"],
        },
        {
          label: "Total Request CFRD this Year",
          data: yearlyRequestOfDocument1WithZeros,
          backgroundColor: ["#0f5132"],
        },
        {
          label: "Total Request HD this Year",
          data: yearlyRequestOfDocument2WithZeros,
          backgroundColor: ["#842029"],
        },
      ],
    },
  ];

  console.log(monthlyDataHd);

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
          label: "monthly request of all documents",
          data: monthlyData && monthlyData.map((data) => data.total_requests),
          backgroundColor: [" #c1b019"],
        },
        {
          label: "monthly request of cfrd",
          data: monthlyRequestOfDocument1WithZeros,
          backgroundColor: ["#0f5132"],
        },
        {
          label: "monthly request of hd",
          data: monthlyRequestOfDocument2WithZeros,
          backgroundColor: ["#842029"],
        },
      ],
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
    <div className="dashboard-home">
      <Sidebar
        myProps1={link[0].link}
        myProps2={link[1].link}
        myProps6={link[2].link}
        DATA={data}
        myProps7={adminLogout}
      />
      <div className="dashboard-home-container">
        <Navbar classNam="dashboard-navbar" />

        <div className="dashboard-home-widgets">
          <div>
            <h1>DASHBOARD</h1>
          </div>
          <div className="dashboard-widgets">
            {Data.map((data) => (
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
