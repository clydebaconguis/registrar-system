import React, { useEffect, useState } from "react";
import "./requests.css";
import Container from "../../components/container/Container";
import SoloPage from "../../components/solopage/SoloPage";
import { Box } from "@mui/material";
import { CgClose } from "react-icons/cg";
import HDprofile from "../../components/HDprofile/HDprofile";
import { useLocation } from "react-router-dom";
import { axiosInstance} from "../../config";
// import { Carousel } from "react-responsive-carousel";
// import { BsCaretRightFill, BsFillCaretLeftFill } from "react-icons/bs";
export default function Requests() {
  //show TOR >>>
  const [showFormTor, setShowFormTor] = useState(false);
  // const [userRequests, setUserRequests] = useState([]);
  const [requestCFRD, setRequestCFRD] = useState([]);

  const [validatedCFRD, setValidateCFRD] = useState([]);

  // end //

  //show HD
  const [showFormHd, setShowFormHd] = useState(false);
  const [userRequestHd, setUserRequestHd] = useState([]);
  const [requestHD, setRequestHD] = useState([]);
  //end//

  //show WD
  //end//

  const [showStatus, setShowStatus] = useState(true);

  const [filterData, setFilteredData] = useState([]);
  const [approvals, setApprovals] = useState(["1", "2", "3", "4"]);
  const [approvalDate, setApprovalDate] = useState([]);
  const [departments, setDepartments] = useState([""]);
  // const [currentIndex, setCurrentIndex] = useState(0);

  const [requests, setRequests] = useState([]);
  const [requestsHD, setRequestsHD] = useState([]);
  const site = useLocation();

  //combine all request

  useEffect(() => {
    const combinedRequests = [...validatedCFRD, ...requestCFRD];
    const uniqueRequests = combinedRequests.filter(
      (request, index, self) =>
        self.findIndex((r) => r.id === request.id) === index
    );
    setRequests(uniqueRequests);
  }, [validatedCFRD, requestCFRD]);
  //
  useEffect(() => {
    const combinedRequests = [...userRequestHd, ...requestHD];
    const uniqueRequests = combinedRequests.filter(
      (request, index, self) =>
        self.findIndex((r) => r.id === request.id) === index
    );
    setRequestsHD(uniqueRequests);
  }, [userRequestHd, requestHD]);

  // useEffect(() => {
  //   const combinedRequests = [...userRequestWdf, ...requestWDF];
  //   const uniqueRequests = combinedRequests.filter(
  //     (request, index, self) =>
  //       self.findIndex((r) => r.id === request.id) === index
  //   );
  //   setRequestsWDF(uniqueRequests);
  // }, [userRequestWdf, requestWDF]);
  //end of combining all request
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axiosInstance.get(
          "/request/allrequest"
        );
        setValidateCFRD(res1.data);

        const res2 = await axiosInstance.get(
          "/request/getRequestHd"
        );
        setUserRequestHd(res2.data);
        const res4 = await axiosInstance.get(
          "/request/getRequestValidating"
        );
        setRequestCFRD(res4.data);

        const res6 = await axiosInstance.get(
          "/request/getRequestHDValidating"
        );
        setRequestHD(res6.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [site]);

  const viewRequest = (id) => {
    const userData = requests.filter((item) => item.id === id);

    setShowFormTor(true);
    setFilteredData(userData);
    setShowStatus(false);
    setDepartments(
      userData[0].Departments ? userData[0].Departments.split(`,`) : [""]
    );
    setApprovals(
      userData[0].approvals.split(`,`) ? userData[0].approvals.split(`,`) : [""]
    );
    setApprovalDate(
      userData[0].approvalDate.split(`,`)
        ? userData[0].approvalDate.split(`,`)
        : [""]
    );
  };

  const viewRequestHd = (id) => {
    const bool = false;
    const userData = userRequestHd.filter((item) => item.id === id);

    if (userData.length > 0 ? userData[0].Departments : bool) {
      setShowFormHd(true);
      setShowStatus(false);
      setFilteredData(userData);
      setDepartments(
        userData[0].Departments ? userData[0].Departments.split(`,`) : [""]
      );
      setApprovals(userData[0].approvals.split(`,`));
      setApprovalDate(userData[0].approvalDate.split(`,`));
    } else {
      const userData = requestHD.filter((item) => item.id === id);
      setShowFormHd(true);
      setFilteredData(userData);
      setShowStatus(false);
      setDepartments([""]);
      setApprovals([""]);
      setApprovalDate([""]);
    }
  };

  const documentStatus = [
    {
      id: 1,
      title: "ALL REQUEST",
      className: `request-top-title`,
      data: (
        <div className="request-bottom-container">
          <div className="requests-container">
            {requests.map((user, index) => (
              <Box className="requests-list-container" key={index}>
                <Container props={user} />
                <div className="request-btn-container">
                  <div
                    className="request-view-btn"
                    onClick={() => {
                      viewRequest(user.id);
                    }}
                  >
                    View
                  </div>

                  <div className="request-delete-btn">delete</div>
                </div>
              </Box>
            ))}
            {requestsHD.map((user, index) => (
              <Box className="requests-list-container" key={user.id}>
                <Container props={user} />
                <div className="request-btn-container">
                  <div
                    className="request-view-btn"
                    onClick={() => {
                      viewRequestHd(user.id);
                    }}
                  >
                    View
                  </div>

                  <div className="request-delete-btn">delete</div>
                </div>
              </Box>
            ))}
          </div>
        </div>
      ),
    },
    // {
    //   id: 2,
    //   title: "Honorable Dismissal",
    //   className: `request-top-title`,
    //   data: (
    //     <div className="request-bottom-container">
    //       <div className="requests-container">
    //         {requestsHD.map((user, index) => (
    //           <Box className="requests-list-container" key={user.id}>
    //             {index + 1}.
    //             <Container props={user} />
    //             <div className="request-btn-container">
    //               <div
    //                 className="request-view-btn"
    //                 onClick={() => {
    //                   viewRequestHd(user.id);
    //                 }}
    //               >
    //                 View
    //               </div>

    //               <div className="request-delete-btn">delete</div>
    //             </div>
    //           </Box>
    //         ))}
    //       </div>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="requests-main-container">
      {showStatus && (
        <div className="request-top-container">
          {documentStatus.map((data) => (
            <div key={data.id} className="request-top">
              <span className={data.className}>{data.title}</span>
              {data.data}
            </div>
          ))}
        </div>
      )}

      {showFormTor && (
        <div className="request-bottom">
          <div className="request-icon-container">
            <CgClose
              className="request-icon"
              onClick={() => {
                setShowFormTor(false);
                setShowStatus(true);
              }}
            />
          </div>
          <SoloPage
            props={filterData}
            Departments={departments}
            approvals={approvals}
            approvalDate={approvalDate}
          />
        </div>
      )}
      {showFormHd && (
        <div className="request-bottom">
          <div className="request-icon-container">
            <CgClose
              className="request-icon"
              onClick={() => {
                setShowFormHd(false);
                setShowStatus(true);
              }}
            />
          </div>
          <HDprofile
            props={filterData}
            departments={departments}
            approvals={approvals}
            approvalDate={approvalDate}
          />
        </div>
      )}
    </div>
  );
}
