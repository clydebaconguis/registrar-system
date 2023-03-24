import React, { useState, useEffect, useRef, useContext } from "react";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Widget from "../components/widgets/Widget";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "../components/DataTable/DataTable";
import { CgClose } from "react-icons/cg";
import { BsArrowUpShort } from "react-icons/bs";
import HDprofile from "../components/HDprofile/HDprofile";
import { AuthContext } from "../../clientPage/components/context/authContext";
import Confirm from "../components/confirmPopUp/confirm";
import DatePopUp from "../components/releaseDatePopUp/datePopUp";
import ValidatePopUp from "../components/claimPopUp/ClaimPopUp";

function RequestHD() {
  const [claimRequest, setClaimRequest] = useState([]);
  const [holdRequest, setHoldRequest] = useState([]);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [approvedRequest, setApprovedRequest] = useState([]);
  const [declinedRequest, setDeclineRequest] = useState([]);
  const [requestHD, setRequestHD] = useState([]);
  const [requestHD1, setRequestHD1] = useState([]);
  const [validatingRequest, setValidatingRequest] = useState([]);
  const [allData, setAllData] = useState([]);
  const [filterData, setFilteredData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [actionColumn, setActionColumn] = useState([]);
  const [datePopUp, setDatePopUp] = useState(false);
  const [confirmPopUp, setConfirmPopUp] = useState(false);
  const [note, setNote] = useState("");
  const [theID, setTheID] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const { adminLogout } = useContext(AuthContext);
  const [showValidatePopUp, setShowValidatedPopUp] = useState(false);
  const Data = [
    {
      id: 4,
      title: "Validating",
      totalAmount: validatingRequest.length,
      Link: "#",
      newData: 0,
      linkTitle: "SHOW",
    },
    {
      id: 1,
      title: "Pending",
      totalAmount: pendingRequest.length,
      link: "#",
      newData: 0,
      linkTitle: "SHOW",
    },
    {
      id: 2,
      title: "Approved",
      totalAmount: approvedRequest.length,
      link: "#",
      newData: 0,
      linkTitle: "SHOW",
    },
    {
      id: 5,
      title: "Hold",
      totalAmount: holdRequest.length,
      link: "#",
      newData: 2,
      linkTitle: "SHOW",
    },
    {
      id: 6,
      title: "Claimed",
      totalAmount: claimRequest.length,
      link: "#",
      newData: 2,
      linkTitle: "SHOW",
    },
    {
      id: 3,
      title: "Declined",
      totalAmount: declinedRequest.length,
      link: "#",
      newData: 2,
      linkTitle: "SHOW",
    },
    {
      id: 7,
      title: "Unclaimed",
      totalAmount: 0,
      link: "#",
      newData: 2,
      linkTitle: "SHOW",
    },
  ];
  const myDivRef = useRef(null);
  const myTableDiv = useRef(null);
  const myWidgetDiv = useRef(null);
  const handleCheckboxChange = (value, type) => {
    let i = 1;
    const typeMap = {
      1: {
        data: pendingRequest,
        title: "PENDING REQUEST",
        column: pendingColumn,
      },
      2: {
        data: approvedRequest,
        title: "APPROVED REQUEST",
        column: approvedColumn,
      },
      3: {
        data: declinedRequest,
        title: "DECLINED REQUEST",
        column: declinedColumn,
      },
      4: {
        data: validatingRequest,
        title: "VALIDATING REQUEST",
        column: validateColumn,
      },
      5: { data: holdRequest, title: "HOLD REQUEST", column: holdColumn },
      6: { data: claimRequest, title: "CLAIMED REQUEST", column: claimColumn },
    };

    while (i <= 6) {
      if (type === i) {
        setAllData(typeMap[i].data);
        setTitle(typeMap[i].title);
        setActionColumn(typeMap[i].column);
        if (i === 1 || i === 2 || i === 3 || i === 5 || i === 6) {
          myTableDiv.current.scrollIntoView({ behavior: "smooth" });
        }
        break;
      }
      i++;
    }
  };

  const site = useLocation();
  useEffect(() => {
    const combinedRequests = [...requestHD1, ...requestHD];

    const uniqueRequests = combinedRequests.filter(
      (request, index, self) =>
        self.findIndex((r) => r.id === request.id) === index
    );
    setRequests(uniqueRequests);
  }, [requestHD, requestHD1]);

  console.log(requests);
  const approveRequestHD = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/api/admin/request/CFRD/${id}`,
        { note: note }
      );
      setAllData(allData.filter((item) => item.id !== theID));
      setShowValidatedPopUp(!showValidatePopUp);
      alert(res.data);
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };

  const viewRequest = (id) => {
    const userData = requests.filter((item) => item.id === id);
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
      width: 150,
      renderCell: (params) => {
        const name = `${params.row.fname} ${params.row.lname} ${params.row.mname}`;
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
              className="columnDecline"
              onClick={() => holdTheRequest(params.row.id, "DECLINED", name)}
            >
              Decline
            </div>
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
      width: 350,
      renderCell: (params) => {
        const name = `${params.row.fname} ${params.row.lname} ${params.row.mname}`;
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
              className="columnDate"
              onClick={() => {
                addReleaseDate(params.row.id);
              }}
            >
              Release Date
            </div>
            <div
              className="columnDecline"
              onClick={() => {
                holdTheRequest(params.row.id, "HOLD", name);
              }}
            >
              Hold Request
            </div>
            <div
              className="columnApprove"
              onClick={() => {
                holdTheRequest(params.row.id, "CLAIMED", name);
              }}
            >
              Claim
            </div>
          </div>
        );
      },
    },
    {
      field: "releaseDate",
      headerName: "Release Date",
      width: 200,
    },
  ];

  const declinedColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      renderCell: (params) => {
        const name = `${params.row.fname} ${params.row.lname} ${params.row.mname}`;
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
              onClick={() => showConfirmPopUp(params.row.id, "APPROVED", name)}
            >
              Approve
            </div>
          </div>
        );
      },
    },
  ];

  const claimColumn = [
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

  const holdColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 200,
      renderCell: (params) => {
        const name = `${params.row.fname} ${params.row.lname} ${params.row.mname}`;
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
              onClick={() => {
                holdTheRequest(params.row.id, "APPROVED", name);
              }}
            >
              Approve
            </div>
            <div className="columnDecline">Decline</div>
          </div>
        );
      },
    },
  ];

  const updateTheRequest = async (message) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/api/admin/request/holdApprovedRequest/${theID}`,
        {
          message: message,
          note: note,
        }
      );

      setAllData(allData.filter((item) => item.id !== theID));

      setConfirmPopUp(!confirmPopUp);

      alert(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const holdTheRequest = (id, note, name) => {
    setTheID(id);
    setNote(note);
    setName(name);
    setConfirmPopUp(!confirmPopUp);
  };

  const addReleaseDate = (id) => {
    setTheID(id);
    setDatePopUp(!datePopUp);
    setAllData(allData);
  };

  const showConfirmPopUp = (id, note, name) => {
    setTheID(id);
    setNote(note);
    setName(name);
    setShowValidatedPopUp(!showValidatePopUp);
  };
  const validateColumn = [
    {
      field: "action",
      headerName: "ACTION",
      width: 220,
      renderCell: (params) => {
        const name = `${params.row.fname} ${params.row.lname} ${params.row.mname}`;
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
              onClick={() => showConfirmPopUp(params.row.id, "PENDING", name)}
            >
              Approve
            </div>
            <div
              className="columnDecline"
              onClick={() => {
                showConfirmPopUp(params.row.id, "DELETE", name);
              }}
            >
              DELETE
            </div>
          </div>
        );
      },
      headerStyle: { textAlign: "center" },
    },
  ];
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = () => {
      const pendingData = requests.filter(
        (item) => item.approval === "PENDING"
      );
      setPendingRequest(pendingData);
      const approvedData = requests.filter(
        (item) => item.approval === "APPROVED"
      );

      setApprovedRequest(approvedData);
      const declinedData = requests.filter(
        (item) => item.approval === "DECLINED"
      );
      setDeclineRequest(declinedData);

      const validating = requests.filter(
        (item) => item.approval === "VALIDATING"
      );
      setValidatingRequest(validating);
      const hold = requests.filter((item) => item.approval === "HOLD");
      setHoldRequest(hold);
      const claim = requests.filter((item) => item.approval === "CLAIMED");
      setClaimRequest(claim);
    };

    fetchData();
  }, [requests]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/admin/request/getRequestsHD"
        );
        setRequestHD(res.data[0]);
        setRequestHD1(res.data[1]);
      } catch (err) {
        console.log(err);
        navigate("/admin/login");
      }
    };

    fetchData();
  }, [site, navigate, allData]);

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
      {confirmPopUp && (
        <Confirm
          onConfirm={holdTheRequest}
          onSubmit={updateTheRequest}
          ID={theID}
          note={note}
          name={name}
        />
      )}
      {datePopUp && <DatePopUp onCancel={addReleaseDate} ID={theID} />}
      <Sidebar
        myProps1="/admin/dashboard/allrequest"
        myProps2="/admin/home"
        myProps6="/admin/login"
        DATA={data}
        myProps7={adminLogout}
      />
      {showValidatePopUp && (
        <ValidatePopUp
          onConfirm={approveRequestHD}
          onCancel={showConfirmPopUp}
          ID={theID}
          note={note}
          name={name}
        />
      )}
      <div className="admin-requests-wrapper">
        <Navbar />
        <div
          className={`admin-request-top-container${
            datePopUp || showValidatePopUp || confirmPopUp ? " disabled" : ""
          }`}
        >
          <div className="admin-requests-top" ref={myWidgetDiv}>
            <span className="admin-top-title">
              REQUEST FOR HONORABLE DISMISSAL
            </span>
            <div className="admin-requests-widget">
              {Data.map((data) => (
                <Widget
                  {...data}
                  key={data.id}
                  onClick={handleCheckboxChange}
                />
              ))}
            </div>
          </div>

          <div className="admin-requests-middle" ref={myTableDiv}>
            <div className="admin-request-iconClose">
              <BsArrowUpShort
                className="admin-request-btn"
                onClick={formClose}
              />
            </div>

            <div>
              <DataTable
                props={allData}
                className="admin-request-table"
                title={title}
                actionColumn={actionColumn}
              />
            </div>
          </div>
          <div className="admin-request-bottom-container" ref={myDivRef}>
            {showForm && (
              <div className="admin-request-bottom">
                <div className="admin-request-iconClose">
                  <CgClose className="admin-request-btn" onClick={formClose} />
                </div>
                <HDprofile props={filterData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestHD;
