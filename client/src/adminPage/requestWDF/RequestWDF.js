import React, { useState, useEffect, useRef, useContext } from "react";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Widget from "../components/widgets/Widget";
import { useLocation, useNavigate } from "react-router-dom";
import WDFprofile from "../components/wdfprofile/WDFprofile";
import axios from "axios";
import DataTable from "../components/DataTable/DataTable";
import { CgClose } from "react-icons/cg";
import { BsArrowUpShort } from "react-icons/bs";
import { AuthContext } from "../../clientPage/components/context/authContext";
function RequestWDF() {
  const [pending, setPending] = useState("");
  const [approved, setApproved] = useState("");
  const [declined, setDeclined] = useState("");
  const [validating, setValidating] = useState("");
  const [pendingRequest, setPendingRequest] = useState([]);
  const [approvedRequest, setApprovedRequest] = useState([]);
  const [declinedRequest, setDeclineRequest] = useState([]);
  const [validatingRequest, setValidatingRequest] = useState([]);
  const [showPending, setShowPending] = useState(true);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeclined, setShowDeclined] = useState(false);
  const [showValidating, setShowValidating] = useState(false);
  const [showTable, setShowtable] = useState(true);
  const [allData, setAlldata] = useState([]);
  const [filterData, setFilteredData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { adminLogout } = useContext(AuthContext);
  const Data = [
    {
      id: 4,
      title: "Validating",
      totalAmount: validating,
      Link: "#",
      newData: 0,
      linkTitle: "See all Validating",
    },
    {
      id: 1,
      title: "Total Pending",
      totalAmount: pending,
      link: "#",
      newData: 0,
      linkTitle: "See all Pending",
    },
    {
      id: 2,
      title: "Total Approved",
      totalAmount: approved,
      link: "#",
      newData: 0,
      linkTitle: "See all Approved",
    },
    {
      id: 3,
      title: "Total Declined",
      totalAmount: declined,
      link: "#",
      newData: 2,
      linkTitle: "See all Declined",
    },
  ];
  const myDivRef = useRef(null);
  const myTableDiv = useRef(null);
  const myWidgetDiv = useRef(null);
  const handleCheckboxChange = (value, type) => {
    if (type === 1) {
      myTableDiv.current.scrollIntoView({ behavior: "smooth" });
      setShowPending(true);
      setShowApproved(false);
      setShowDeclined(false);
      setShowValidating(false);
      setShowtable(true);
    } else if (type === 2) {
      myTableDiv.current.scrollIntoView({ behavior: "smooth" });
      setShowApproved(true);
      setShowDeclined(false);
      setShowPending(false);
      setShowtable(true);
      setShowValidating(false);
    } else if (type === 3) {
      myTableDiv.current.scrollIntoView({ behavior: "smooth" });
      setShowDeclined(true);
      setShowApproved(false);
      setShowPending(false);
      setShowtable(true);
      setShowValidating(false);
    } else {
      setShowValidating(true);
      setShowDeclined(false);
      setShowApproved(false);
      setShowPending(false);
      setShowtable(true);
    }
  };

  const site = useLocation();

  const approveRequestWDF = async (id) => {
    console.log(id);
    try {
      const res = await axios.put(
        `http://localhost:3001/api/admin/request/WDF/${id}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  const viewRequest = (id) => {
    const userData = allData.filter((item) => item.id === id);
    myDivRef.current.scrollIntoView({ behavior: "smooth" });
    setFilteredData(userData);
    setShowForm(true);
  };
  const formClose = () => {
    setShowForm(false);

    myWidgetDiv.current.scrollIntoView({ behavior: "smooth" });
  };
  const pendingColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 220,
      renderCell: (params) => {
        return (
          <div className="tableAction">
            <div
              className="columnView"
              onClick={() => {
                viewRequest(params.row.id);
              }}
            >
              View
            </div>
            <div className="columnApprove">Approve</div>
            <div className="columnDecline">Decline</div>
          </div>
        );
      },
      headerStyle: { textAlign: "center" },
    },
  ];

  const approvedColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="tableAction">
            <div
              className="columnView"
              onClick={() => {
                viewRequest(params.row.id);
              }}
            >
              View
            </div>
          </div>
        );
      },
    },
  ];

  const declinedColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="tableAction">
            <div
              className="columnView"
              onClick={() => {
                viewRequest(params.row.id);
              }}
            >
              View
            </div>
          </div>
        );
      },
    },
  ];

  const validateColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 220,
      renderCell: (params) => {
        return (
          <div className="tableAction">
            <div
              className="columnView"
              onClick={() => {
                viewRequest(params.row.id);
              }}
            >
              View
            </div>
            <div
              className="columnApprove"
              onClick={() => approveRequestWDF(params.row.id)}
            >
              Approve
            </div>
            <div className="columnDecline">Decline</div>
          </div>
        );
      },
      headerStyle: { textAlign: "center" },
    },
  ];
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/admin/status/documentStatus/wdf"
        );

        setPending(res.data[0] ? res.data[0] : "0");
        setApproved(res.data[1] ? res.data[1] : "0");
        setDeclined(res.data[2] ? res.data[2] : "0");
        setValidating(res.data[3] ? res.data[3] : "0");
      } catch (err) {
        console.log(err);
        navigate("/admin/login");
      }
    };

    fetchData();
  }, [site]);

  useEffect(() => {
    const fetchData = () => {
      const pendingData = allData.filter(
        (item) => item.approvals === "PENDING"
      );
      setPendingRequest(pendingData);
      const approvedData = allData.filter(
        (item) => item.approvals === "APPROVED"
      );
      setApprovedRequest(approvedData);
      const declinedData = allData.filter(
        (item) => item.approval === "DECLINED"
      );
      setDeclineRequest(declinedData);
      const validating = allData.filter(
        (item) => item.approvals === "VALIDATING"
      );
      setValidatingRequest(validating);
    };

    fetchData();
  }, [site]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/admin/request/getRequestsWDF"
        );
        setAlldata(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [site]);
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

  return (
    <div className="admin-requests-container">
      <Sidebar
        myProps1="/admin/dashboard/allrequest"
        myProps2="/admin/home"
        myProps6="/admin/login"
        DATA={data}
        myProps7={adminLogout}
      />

      <div className="admin-requests-wrapper">
        <Navbar />
        <div className="admin-requests-top" ref={myWidgetDiv}>
          <h1>WITHDRAWAL FORM</h1>
          <div className="admin-requests-widget">
            {Data.map((data) => (
              <Widget {...data} key={data.id} onClick={handleCheckboxChange} />
            ))}
          </div>
        </div>

        <div className="admin-requests-middle" ref={myTableDiv}>
          <div className="admin-request-iconClose">
            <BsArrowUpShort className="admin-request-btn" onClick={formClose} />
          </div>
          {showTable && (
            <div>
              {showPending && (
                <DataTable
                  props={pendingRequest}
                  className="admin-request-table"
                  title="PENDING REQUEST"
                  actionColumn={pendingColumn}
                />
              )}
              {showApproved && (
                <DataTable
                  props={approvedRequest}
                  className="admin-request-table"
                  title="APPROVED REQUEST"
                  actionColumn={approvedColumn}
                />
              )}
              {showDeclined && (
                <DataTable
                  props={declinedRequest}
                  title="DECLINED REQUEST"
                  className="admin-request-table"
                  actionColumn={declinedColumn}
                />
              )}
              {showValidating && (
                <DataTable
                  props={validatingRequest}
                  title="DECLINED REQUEST"
                  className="admin-request-table"
                  actionColumn={validateColumn}
                />
              )}
            </div>
          )}
        </div>
        <div className="admin-request-bottom-container" ref={myDivRef}>
          {showForm && (
            <div className="admin-request-bottom">
              <div className="admin-request-iconClose">
                <CgClose className="admin-request-btn" onClick={formClose} />
              </div>
              <WDFprofile props={filterData} />
            </div>
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default RequestWDF;
