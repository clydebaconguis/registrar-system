import { db } from "../../db.js";
import jwt, { verify } from "jsonwebtoken";
import { response } from "express";
import { cloudinary } from "../../utils/cloudinary.js";
const getRoleIDandDepartmentID = (id) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT Admin_roleID as roleID , Admin_departmentID as depID FROM admin_profile WHERE Admin_userID = ?`;
    db.query(q, [id], (err, response) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(response);
      }
    });
  });
};

const getAllCfrdRequest = (values, query) => {
  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, result) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(result);
      }
    });
  });
};

const getTheSignatoriesId = (values) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT Signatories_ID as id from signatories
    WHERE Signatories_adminRoleID = ?
    AND Signatories_departmentID = ?
    AND Signatories_documentID IN (?)`;
    db.query(q, values, (err, response) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(response);
      }
    });
  });
};

const approveAllRequest = () => {
  return new Promise((resolve, reject) => {
    const q = `
    SELECT c.Clearance_requestID  AS id
    FROM clearance c
    INNER JOIN requests r ON c.Clearance_requestID = r.Request_ID
    WHERE r.Request_adminNote in (?)
    GROUP BY c.Clearance_requestID
    HAVING MIN(c.Clearance_adminNote) = ? AND MAX(c.Clearance_adminNote) = ?
    `;
    const values = [["APPROVED", "PENDING"], "APPROVED","APPROVED"];
    db.query(q, values, (err, response) => {
      if (err) {
        return reject(err);
      }
      const date = new Date();
      for (let i = 0; i < response.length; i++) {
        const q = `UPDATE requests SET Request_adminNote =?, Request_dateApproved =? WHERE Request_ID = ?`;
        const values = ["APPROVED", date, response[i].id];
        db.query(q, values, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      return resolve(response);
    });
  });
};

export const getAllTheCFRDRequests = (req, res) => {
  const token = req.session.admin;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "admin_jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const queryForGettingTheValidatingRequest = `SELECT Request_ID as id, Student_userID as user_ID,
 Student_firstName as fname,
 Student_lastName as lname,
 Student_MiddleName as mname,
 Student_schoolID as schoolID,
 Student_emailAddress as email,
 Student_currentAddress as address,
 Student_phoneNumber as phoneNumber,
 Student_yearLevel as yearLevel,
 Student_semester as semester,
 Student_lastSchoolYearAttended 	as schoolYear,
 Student_enrollmentStatus as status,
 Course_Code as courseCode,
 Course_Description as course,
 DATE_FORMAT(Request_Date, ' %M %d %Y %r') as requestDate,
 DATE_FORMAT(Request_releaseDate, ' %M %d %Y %r') as releaseDate,
 DATE_FORMAT(Request_dateApproved , ' %M %d %Y %r') as approveDate,
 Request_adminNote as approval,
 Document_Title as document,
 Role_Description as Departments,
 Department_Description as Department,
 CFRD_Certificates as certificates,
 CFRD_imageUrl as image,
 CASE WHEN Purpose_Description IS NULL THEN 'NO' ELSE Purpose_Description  END AS purpose,
 IFNULL(Messages, 'NO') AS messages,
 IFNULL(MessageDates, 'NO') AS messageDates
 FROM requests
 INNER JOIN documents ON Request_documentID = Document_ID
 INNER JOIN student_form ON Request_studentID = Student_ID
 INNER JOIN cfrd_requirements ON CFRD_requestID = Request_ID
 INNER JOIN courses ON Student_courseID = Course_ID
 INNER JOIN signatories ON Request_signatoriesID = Signatories_ID
 INNER JOIN departments on Signatories_departmentID =Department_ID
 INNER JOIN admin_role ON Signatories_adminRoleID = Role_ID
 LEFT JOIN tor_purpose ON Purpose_requestID = Request_ID
 LEFT JOIN (
   SELECT Message_requestID, GROUP_CONCAT('|',Message_Text) AS Messages, 
          GROUP_CONCAT(DATE_FORMAT('|',Message_Date, ' %M %d %Y %r')) AS MessageDates
   FROM messages 
   GROUP BY Message_requestID
) AS msg ON Request_ID = Message_requestID
WHERE Request_signatoriesID =?
GROUP BY Request_ID`;

    const queryForGettingTheValidatedRequest = `SELECT
    req.Request_ID as id, 
    std.Student_userID as user_ID,
    std.Student_firstName as fname,
    std.Student_lastName as lname,
    std.Student_MiddleName as mname,
    std.Student_schoolID as schoolID,
    std.Student_currentAddress as address,
    std.Student_emailAddress as email,
    std.Student_phoneNumber as phoneNumber,
    std.Student_yearLevel as yearLevel,
    std.Student_semester as semester,
    std.Student_lastSchoolYearAttended as schoolYear,
    std.Student_enrollmentStatus as status,
    crs.Course_Code as courseCode,
    crs.Course_Description as course,
    DATE_FORMAT(req.Request_Date, ' %M %d %Y %r') as requestDate,
    DATE_FORMAT(req.Request_dateApproved, ' %M %d %Y %r') as approveDate,
    DATE_FORMAT(req.Request_releaseDate, ' %M %d %Y %r') as releaseDate,
    cfrd.CFRD_Certificates as certificates,
    CFRD_imageUrl as image,
    req.Request_adminNote as approval,
    req.Request_releaseDate as releaseDate,
    req.Request_dateApproved as approveDate,
    doc.Document_Title as document,
    GROUP_CONCAT(DATE_FORMAT(clr.Clearance_dateUpdated,' %M %d %Y %r')) as approvalDate,
    GROUP_CONCAT(role.Role_Description) as Departments,
    GROUP_CONCAT(clr.Clearance_adminNote) as approvals,
    CASE WHEN Purpose_Description IS NULL THEN 'NO' ELSE Purpose_Description  END AS purpose,
    IFNULL(msg.Messages, 'NO') AS messages,
    IFNULL(msg.MessageDates, 'NO') AS messageDates
FROM requests req
INNER JOIN student_form std ON req.Request_studentID = std.Student_ID
INNER JOIN courses crs ON std.Student_courseID = crs.Course_ID
INNER JOIN documents doc ON req.Request_documentID = doc.Document_ID
INNER JOIN cfrd_requirements cfrd ON req.Request_ID = cfrd.CFRD_requestID
INNER JOIN clearance clr ON req.Request_ID = clr.Clearance_requestID
INNER JOIN signatories sig ON clr.Clearance_signatoriesID = sig.Signatories_ID
INNER JOIN admin_role role ON sig.Signatories_adminRoleID = role.Role_ID
INNER JOIN departments dept ON sig.Signatories_departmentID = dept.Department_ID
LEFT JOIN tor_purpose ON Purpose_requestID = Request_ID
LEFT JOIN (
    SELECT Message_requestID, GROUP_CONCAT('|',Message_Text) AS Messages, 
           GROUP_CONCAT('|',DATE_FORMAT(Message_Date, ' %M %d %Y %r')) AS MessageDates
    FROM messages 
    GROUP BY Message_requestID
) AS msg ON req.Request_ID = msg.Message_requestID
WHERE req.Request_signatoriesID = ?
GROUP BY req.Request_ID`;
    try {
      await approveAllRequest();
      const theRoleIdAndDepId = await getRoleIDandDepartmentID(userInfo.id);
      const RoleID = theRoleIdAndDepId[0].roleID; //the role id of admin user
      const DepID = theRoleIdAndDepId[0].depID; // the department id of admin user
      const valuesOfGettingSignatoryId = [RoleID, DepID, 1];
      const theSignatoriesIdOfDocument1 = await getTheSignatoriesId(
        valuesOfGettingSignatoryId
      );
      const SignatoryIDOfDocument1 = theSignatoriesIdOfDocument1[0].id;
      const dataOfValidatingCfrdRequest = await getAllCfrdRequest(
        SignatoryIDOfDocument1,
        queryForGettingTheValidatingRequest
      );
      const dataOfValidatedCfrdRequest = await getAllCfrdRequest(
        SignatoryIDOfDocument1,
        queryForGettingTheValidatedRequest
      );
      const allData = [dataOfValidatingCfrdRequest, dataOfValidatedCfrdRequest];
      return res.status(200).send(allData);
    } catch (err) {
      console.log(err);
      res.status(500).json("something went wrong");
    }
  });
};

export const getAllRequestWDF = (req, res) => {
  // const token = req.session.admin;
  // if (!token) return res.status(401).json("Not Authenticated");
  // jwt.verify(token, "admin_jwtkey", (err, userInfo) => {
  //   if (err) return res.status(403).json("User not valid");
  //   const q = `SELECT Admin_ID FROM admin_profile WHERE Admin_userID = ?`;
  //   db.query(q, [userInfo.id], (err, adminID) => {
  //     if (err) return console.log(err);
  //     const ID = adminID[0].Admin_ID;
  //     const q = `SELECT WDF_ID as id,
  //     Student_userID as user_ID,
  //       Student_firstName as fname,
  //       Student_lastName as lname,
  //       Student_MiddleName as mname,
  //       Student_schoolID as schoolID,
  //       Student_currentAddress as address,
  //       Student_phoneNumber as phoneNumber,
  //       Student_yearLevel as yearLevel,
  //       Student_semester as semester,
  //       Student_lastSchoolYearAttended 	as schoolYear,
  //       Student_enrollmentStatus as status,
  //       Student_emailAddress as email,
  //       Course_Code as courseCode,
  //       Course_Description as course,
  //       DATE_FORMAT(WDF_releaseDate, ' %M %d %Y %r' ) as  releaseDate,
  //       DATE_FORMAT(WDF_approveDate, ' %M %d %Y %r') as approveDate,
  //       DATE_FORMAT(WDF_requestDate, ' %M %d %Y %r') as requestDate,
  //       DATE_FORMAT(WDF_requestDate, ' %M %d %Y %r') as dateUpdated,
  //       WDF_withdrawThisSemester as semesterTransfer,
  //       WDF_adminNote as approvals,
  //       WDF_schoolYear as year,
  //       WDF_units as units,
  //       WDF_studentRemarks as studentRemarks,
  //       WDF_interviewerRemarks as interviewerRemarks,
  //       Document_Title as document
  //       FROM wdf_request
  //       INNER JOIN documents ON WDF_documentID = Document_ID
  //       INNER JOIN student_form ON WDF_studentID = Student_ID
  //       INNER JOIN courses ON Student_courseID = Course_ID
  //       INNER JOIN admin_profile ON WDF_adminID = Admin_ID
  //       INNER JOIN departments ON Admin_departmentID = Department_ID
  //       WHERE WDF_adminID = ? AND WDF_documentID = ?
  //       GROUP BY WDF_ID`;
  //     db.query(q, [ID, 2], (err, result) => {
  //       if (err) return console.log(err);
  //       res.send(result);
  //     });
  //   });
  // });
};

export const getAllHdRequest = (req, res) => {
  const token = req.session.admin;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "admin_jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const queryForGettingTheValidatingRequest = `SELECT Request_ID as id, Student_userID as user_ID,
    Student_firstName as fname,
    Student_lastName as lname,
    Student_MiddleName as mname,
    Student_schoolID as schoolID,
    Student_emailAddress as email,
    Student_currentAddress as address,
    Student_phoneNumber as phoneNumber,
    Student_yearLevel as yearLevel,
    Student_semester as semester,
    Student_lastSchoolYearAttended 	as schoolYear,
    Student_enrollmentStatus as status,
    Course_Code as courseCode,
    Course_Description as course,
    DATE_FORMAT(Request_Date, ' %M %d %Y %r') as requestDate,
    DATE_FORMAT(Request_releaseDate, ' %M %d %Y %r') as releaseDate,
    DATE_FORMAT(Request_dateApproved , ' %M %d %Y %r') as approveDate,
    Request_adminNote as approvals,
    Request_adminNote as approval,
    Document_Title as document,
    Role_Description as Departments,
    Department_Description as Department,
    HD_Semester as semesterTransfer,
    HD_schoolYear as year,
    HD_schooltoTransfer as school,
    HD_studentRemarks as studentRemarks,
    IFNULL(Messages, 'NO') AS messages,
    IFNULL(MessageDates, 'NO') AS messageDates
    FROM requests
    INNER JOIN documents ON Request_documentID = Document_ID
    INNER JOIN student_form ON Request_studentID = Student_ID
    INNER JOIN courses ON Student_courseID = Course_ID
    INNER JOIN signatories ON Request_signatoriesID = Signatories_ID
    INNER JOIN departments on Signatories_departmentID =Department_ID
    INNER JOIN admin_role ON Signatories_adminRoleID = Role_ID
    INNER JOIN hd_requirements ON HD_requestID = Request_ID
    LEFT JOIN (
    SELECT Message_requestID, GROUP_CONCAT('|',Message_Text) AS Messages, 
           GROUP_CONCAT('|',DATE_FORMAT(Message_Date, ' %M %d %Y %r')) AS MessageDates
    FROM messages 
    GROUP BY Message_requestID
) AS msg ON Request_ID = Message_requestID
WHERE Request_signatoriesID = ?
GROUP BY Request_ID`;
    const queryForGettingTheValidatedRequest = `SELECT Request_ID as id, Student_userID as user_ID,
Student_firstName as fname,
Student_lastName as lname,
Student_MiddleName as mname,
Student_schoolID as schoolID,
Student_emailAddress as email,
Student_currentAddress as address,
Student_phoneNumber as phoneNumber,
Student_yearLevel as yearLevel,
Student_semester as semester,
Student_lastSchoolYearAttended 	as schoolYear,
Student_enrollmentStatus as status,
Course_Code as courseCode,
Course_Description as course,
DATE_FORMAT(Request_Date, ' %M %d %Y %r') as requestDate,
DATE_FORMAT(Request_releaseDate, ' %M %d %Y %r') as releaseDate,
DATE_FORMAT(Request_dateApproved , ' %M %d %Y %r') as approveDate,
Request_adminNote as approval,
Document_Title as document,
HD_Semester as semesterTransfer,
HD_schoolYear as year,
HD_schooltoTransfer as school,
HD_studentRemarks as studentRemarks,
GROUP_CONCAT(DATE_FORMAT(Clearance_dateUpdated,' %M %d %Y %r')) as approvalDate,
GROUP_CONCAT(Role_Description) as Departments,
GROUP_CONCAT(Clearance_adminNote) as approvals,
IFNULL(Messages, 'NO') AS messages,
IFNULL(MessageDates, 'NO') AS messageDates
FROM clearance
INNER JOIN requests ON Clearance_requestID = Request_ID
INNER JOIN documents ON Request_documentID = Document_ID
INNER JOIN student_form ON Request_studentID = Student_ID
INNER JOIN hd_requirements ON HD_requestID = Request_ID
INNER JOIN courses ON Student_courseID = Course_ID
INNER JOIN signatories ON Clearance_signatoriesID = Signatories_ID
INNER JOIN admin_role ON Signatories_adminRoleID = Role_ID
INNER JOIN departments ON Signatories_departmentID = Department_ID
LEFT JOIN (
SELECT Message_requestID, GROUP_CONCAT('|',Message_Text) AS Messages, 
       GROUP_CONCAT('|',DATE_FORMAT(Message_Date, ' %M %d %Y %r')) AS MessageDates
FROM messages 
GROUP BY Message_requestID
) AS msg ON Request_ID = Message_requestID
WHERE Request_signatoriesID = ?
GROUP BY Request_ID;`;
    try {
      await approveAllRequest();
      const theRoleIdAndDepId = await getRoleIDandDepartmentID(userInfo.id);
      const RoleID = theRoleIdAndDepId[0].roleID; //the role id of admin user
      const DepID = theRoleIdAndDepId[0].depID; // the department id of admin user
      const valuesOfGettingSignatoryId = [RoleID, DepID, 3];
      const theSignatoriesIdOfDocument3 = await getTheSignatoriesId(
        valuesOfGettingSignatoryId
      );
      const SignatoryIDOfDocument3 = theSignatoriesIdOfDocument3[0].id;
      const dataOfValidatingCfrdRequest = await getAllCfrdRequest(
        SignatoryIDOfDocument3,
        queryForGettingTheValidatingRequest
      );
      const dataOfValidatedCfrdRequest = await getAllCfrdRequest(
        SignatoryIDOfDocument3,
        queryForGettingTheValidatedRequest
      );
      const allData = [dataOfValidatingCfrdRequest, dataOfValidatedCfrdRequest];

      return res.status(200).send(allData);
    } catch (error) {
      console.log(error);
      res.status(500).json("something went wrong");
    }
  });
};

// export const getAllRequestHD = (req, res) => {
//   const token = req.session.admin;
//   if (!token) return res.status(401).json("Not Authenticated");
//   jwt.verify(token, "admin_jwtkey", (err, userInfo) => {
//     if (err) return res.status(403).json("User not valid");
//     const q = `SELECT Admin_roleID as roleID , Admin_departmentID as depID FROM admin_profile WHERE Admin_userID = ?`;

//     db.query(q, [userInfo.id], (err, adminID) => {
//       if (err) return console.log(err);
//       const roleID = adminID[0].roleID;
//       const depID = adminID[0].depID;

//       const q = `SELECT Signatories_ID as id from signatories
//       WHERE Signatories_adminRoleID = ?
//       AND Signatories_departmentID = ?
//       AND Signatories_documentID = ?`;

//       db.query(q, [roleID, depID, 3], (err, signatory) => {
//         if (err) return console.log(err);
//         const sigID = signatory[0].id;

//         const q = `SELECT Request_ID as id, Student_userID as user_ID,
//         Student_firstName as fname,
//         Student_lastName as lname,
//         Student_MiddleName as mname,
//         Student_schoolID as schoolID,
//         Student_emailAddress as email,
//         Student_currentAddress as address,
//         Student_phoneNumber as phoneNumber,
//         Student_yearLevel as yearLevel,
//         Student_semester as semester,
//         Student_lastSchoolYearAttended 	as schoolYear,
//         Student_enrollmentStatus as status,
//         Course_Code as courseCode,
//         Course_Description as course,
//         DATE_FORMAT(Request_Date, ' %M %d %Y %r') as requestDate,
//         DATE_FORMAT(Request_releaseDate, ' %M %d %Y %r') as releaseDate,
//         DATE_FORMAT(Request_dateApproved, ' %M %d %Y %r') as approveDate,
//         Request_adminNote as approvals,
//         Document_Title as document,
//         Role_Description as Departments,
//         Department_Description as Department,
//         HD_Semester as semesterTransfer,
//         HD_schoolYear as year,
//         HD_schooltoTransfer as school,
//         HD_studentRemarks as studentRemarks
//         FROM requests
//         INNER JOIN documents ON Request_documentID = Document_ID
//         INNER JOIN student_form ON Request_studentID = Student_ID
//         INNER JOIN courses ON Student_courseID = Course_ID
//         INNER JOIN signatories ON Request_signatoriesID = Signatories_ID
//         INNER JOIN departments on Signatories_departmentID =Department_ID
//         INNER JOIN admin_role ON Signatories_adminRoleID = Role_ID
//         INNER JOIN hd_requirements ON HD_requestID = Request_ID
//         WHERE Request_signatoriesID = ?
//         GROUP BY Request_ID`;
//       });
//     });
//   });
// };

// export const approveHdRequest = (req, res) => {
//   const token = req.session.admin;
//   const date = new Date();
//   if (!token) return res.status(401).json("Not Authenticated");
//   jwt.verify(token, "admin_jwtkey", (err, userInfo) => {
//     if (err) return res.status(403).json("User not valid");
//     const q = `SELECT HDClearance_hdRequestID as id
//     FROM hd_clearance
//     WHERE HDClearance_adminNote = 'APPROVED'
//     GROUP BY HDClearance_hdRequestID
//     HAVING COUNT(*) = ?`;
//     db.query(q, [6], (err, result) => {
//       if (err) return console.log(err);
//       if (result.length > 0) {
//         for (let i = 0; i < result.length; i++) {
//           const q = `UPDATE hd_request SET HD_adminNote =?, HD_approveDate =? WHERE HD_ID = ?`;
//           db.query(q, ["APPROVED", date, result[i].id], (err, response) => {
//             if (err) return console.log(err);
//             res.send("DONE");
//           });
//         }
//       }
//     });
//   });
// };

export const approveWdfRequest = (req, res) => {
  // const token = req.session.admin;
  // const date = new Date();
  // if (!token) return res.status(401).json("Not Authenticated");
  // jwt.verify(token, "admin_jwtkey", (err, userInfo) => {
  //   if (err) return res.status(403).json("User not valid");
  //   const q = `SELECT WDFClearance_wdfRequestID as id
  //   FROM wdf_clearance
  //   WHERE WDFClearance_adminNote = 'APPROVED'
  //   GROUP BY WDFClearance_wdfRequestID
  //   HAVING COUNT(*) = ?`;
  //   db.query(q, [6], (err, result) => {
  //     if (err) return console.log(err);
  //     if (result.length > 0) {
  //       for (let i = 0; i < result.length; i++) {
  //         const q = `UPDATE WDF_request SET WDF_adminNote =?, WDF_approveDate =? WHERE WDF_ID = ?`;
  //         db.query(q, ["APPROVED", date, result[i].id], (err, response) => {
  //           if (err) return console.log(err);
  //           res.send("DONE");
  //         });
  //       }
  //     }
  //   });
  // });
};

export const approveCFRDRequest = (req, res) => {
  const token = req.session.admin;
  const date = new Date();
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "admin_jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const q = `SELECT DISTINCT c.Clearance_adminNote, c.Clearance_requestID as id
    FROM clearance c
    WHERE c.Clearance_requestID IN (
      SELECT Clearance_requestID
      FROM clearance
      GROUP BY Clearance_requestID
      HAVING COUNT(*) = SUM(Clearance_adminNote = 'APPROVED')
    )
    AND c.Clearance_requestID NOT IN (
      SELECT Request_ID
      FROM requests
      WHERE Request_adminNote = 'HOLD'
    )`;
    db.query(q, ["APPROVED"], (err, result) => {
      if (err) return console.log(err);

      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          const q = `UPDATE requests SET Request_adminNote =?, Request_dateApproved =? WHERE Request_ID = ?`;
          db.query(q, ["APPROVED", date, result[i].id], (err, respons) => {
            if (err) return console.log(err);
          });
        }
      }
    });
  });
};

const selectMyAdminRolID = (id) => {
  const q = `SELECT 
  Admin_roleID  as id ,
  Department_ID as depId 
  from admin_profile 
  INNER JOIN departments ON Admin_departmentID = Department_ID 
  WHERE Admin_userID = ?`;
  return new Promise((resolve, reject) => {
    db.query(q, [id], (err, response) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(response);
      }
    });
  });
};

const functionWithQuery = (values, query) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, response) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(response);
      }
    });
  });
};

const functionWithQueryWithoutRespons = (values, query) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve();
      }
    });
  });
};

const updateClearance = (values) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO clearance
    (Clearance_adminNote,
      Clearance_dateUpdated,
      Clearance_signatoriesID,
      Clearance_requestID) VALUES(?)`;
    db.query(query, [values], (err) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve();
      }
    });
  });
};

const deleteImageFromCloudinary = (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .destroy(public_id)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

export const updateRequest = (req, res) => {
  const token = req.session.admin;
  const reqID = req.params.id;
  const note = req.body.note;
  let count;
  const date = new Date();
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "admin_jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const queryForGettingTheStudentIdandDocumentId = `SELECT Request_studentID as studID,Request_documentID as docID
    FROM requests WHERE Request_ID = ?`;
    const queryForGettingTheSignatoriesIdOfMyDepartment = `SELECT Signatories_ID as signID,
    Signatories_adminRoleID as adminRole
    FROM signatories
    WHERE Signatories_departmentID =?
    AND Signatories_documentID = ?
    AND Signatories_adminRoleID != ?`;
    const queryForGettingAllTheSignatoriesID = `SELECT Signatories_ID as signID
    FROM signatories
    WHERE Signatories_documentID = ?
    AND Signatories_adminRoleID NOT IN (?)`;
    const queryForUpdatingTheRequest = `UPDATE requests SET Request_adminNote =? ,Request_dateApproved =?WHERE Request_ID = ? AND Request_studentID=?`;
    if (note === "PENDING") {
      try {
        const theDepartmentAndRoleId = await selectMyAdminRolID(userInfo.id); //gettinf the department id and role id
        const depId = theDepartmentAndRoleId[0].depId; // inserting the dep id into this variable
        const myAdminRoleId = theDepartmentAndRoleId[0].id; //inserting the roleId into this variable
        const myArrayOfRoleId = []; //creating a array mo Role ID's
        myArrayOfRoleId.push(myAdminRoleId); //pushing the array of Role ID's
        const signatories = []; //aray for all the signatory ID
        const theDocumentId = await functionWithQuery(
          reqID,
          queryForGettingTheStudentIdandDocumentId
        );
        const docId = theDocumentId[0].docID;
        const studid = theDocumentId[0].studID;
        const valuesForSigId = [depId, docId, myAdminRoleId];
        const theSignoryId = await functionWithQuery(
          valuesForSigId,
          queryForGettingTheSignatoriesIdOfMyDepartment
        );

        for (let i = 0; i < theSignoryId.length; i++) {
          signatories.push(theSignoryId[i].signID);
          myArrayOfRoleId.push(theSignoryId[i].adminRole);
        }

        const valuesForGettingAllTheSignatoryId = [docId, myArrayOfRoleId];
        const allOfTheSignatoryId = await functionWithQuery(
          valuesForGettingAllTheSignatoryId,
          queryForGettingAllTheSignatoriesID
        );
        for (let i = 0; i < allOfTheSignatoryId.length; i++) {
          signatories.push(allOfTheSignatoryId[i].signID);
        }

        for (let i = 0; i < signatories.length; i++) {
          const values = [note, date, signatories[i], reqID];
          await updateClearance(values);
          count = signatories.length;
        }

        const valuesForUpdatingTheRequest = [note, date, reqID, studid];
        if (count === signatories.length) {
          await functionWithQuery(
            valuesForUpdatingTheRequest,
            queryForUpdatingTheRequest
          );
        }

        return res.status(200).json("request updated");
      } catch (err) {
        console.log(err);
        res.status(500).json("something went wrong");
      }
    }
    const queryForLookingTheRequestInClearance = ` SELECT * FROM clearance WHERE Clearance_requestID = ?`;
    const queryForUpdatingTheClearance = ` UPDATE clearance SET Clearance_adminNote = ?,Clearance_dateUpdated =? WHERE Clearance_requestID = ? AND Clearance_adminNote =?`;
    if (note === "DECLINED") {
      try {
        const queryForUpdatingTheRequest = `UPDATE requests SET Request_adminNote =? ,Request_dateApproved =?WHERE Request_ID = ?`;
        const values = [note, date, reqID];
        await functionWithQueryWithoutRespons(
          values,
          queryForUpdatingTheRequest
        );

        return res.status(200).json("request updated");
      } catch (err) {
        console.log(err);
        res.status(500).json("something went wrong");
      }
    }

    if (note === "APPROVED") {
      try {
        const ifHaveRequestInClearance = await functionWithQuery(
          reqID,
          queryForLookingTheRequestInClearance
        );

        if (ifHaveRequestInClearance.length > 0) {
          const values = ["PENDING", date, reqID, "DECLINED"];
          await functionWithQueryWithoutRespons(
            values,
            queryForUpdatingTheClearance
          );
        }
        const queryForUpdatingTheRequest = `UPDATE requests SET Request_adminNote =? ,Request_dateApproved =?WHERE Request_ID = ?`;
        const values = ["PENDING", date, reqID];
        await functionWithQueryWithoutRespons(
          values,
          queryForUpdatingTheRequest
        );

        return res.status(200).json("request updated");
      } catch (err) {
        console.log(err);
        res.status(500).json("something went wrong");
      }
    }

    if (note === "DELETE") {
      const queryForDeletingStudent = `DELETE FROM student_form WHERE student_form.Student_ID = ?`;
      const queryForGettingTheStudentId = `SELECT Request_studentID as id from requests WHERE Request_id = ?`;

      try {
        const imagePublicIdQuery = `SELECT CFRD_imageUrl as imageID from cfrd_requirements WHERE CFRD_requestID = ?`;
        const values = [reqID];
        const theImagePublicId = await functionWithQuery(
          values,
          imagePublicIdQuery
        );

        if (theImagePublicId.length > 0) {
          const theImageId = theImagePublicId[0].imageID;
          await deleteImageFromCloudinary(theImageId);
        }

        const valuesForGettingTheStudentId = [reqID];
        const theStudentId = await functionWithQuery(
          valuesForGettingTheStudentId,
          queryForGettingTheStudentId
        );
        const theStudentID = [theStudentId[0].id];
        await functionWithQueryWithoutRespons(
          theStudentID,
          queryForDeletingStudent
        );

        return res.status(200).json("request updated");
      } catch (error) {
        console.log(error);
        res.status(500).json("something went wrong");
      }
    }
  });
};

export const validateRequestHD = (req, res) => {
  // const token = req.session.admin;
  // const signatories = [];
  // const adminRoleId = [];
  // const reqID = req.params.id;
  // const date = new Date();
  // let count;
  // if (!token) return res.status(401).json("Not Authenticated");
  // jwt.verify(token, "admin_jwtkey", (err, userInfo) => {
  //   if (err) return res.status(403).json("User not valid");
  //   const q =
  //     "SELECT HD_studentID,HD_documentID FROM hd_request WHERE HD_ID = ?";
  //   db.query(q, [reqID], (err, result) => {
  //     //first query
  //     if (err) return res.status(404).json("Request not Found !");
  //     const studID = result[0].HD_studentID;
  //     const docsID = result[0].HD_documentID;
  //     const q = ` SELECT Course_departmentID as depID from courses
  //       INNER JOIN student_form
  //       ON Student_courseID = Course_ID
  //       WHERE Student_ID = ?`;
  //     db.query(q, [studID], (err, depID) => {
  //       //second query
  //       if (err) return console.log(err);
  //       const departmentID = depID[0].depID;
  //       const q = `SELECT Signatories_ID as signID,
  //       Signatories_adminRoleID as adminRole
  //       FROM signatories
  //       WHERE Signatories_departmentID = ?
  //       AND Signatories_documentID = ?`;
  //       db.query(q, [departmentID, docsID], (err, signatory) => {
  //         //third query
  //         if (err) return console.log(err);
  //         for (let i = 0; i < signatory.length; i++) {
  //           signatories.push(signatory[i].signID);
  //           adminRoleId.push(signatory[i].adminRole);
  //         }
  //         const q = `SELECT Signatories_ID as signID
  //         FROM signatories
  //         WHERE Signatories_documentID = ?
  //         AND Signatories_adminRoleID NOT IN (?)`;
  //         db.query(q, [docsID, adminRoleId], (err, signID) => {
  //           //fourth query
  //           if (err) return console.log(err);
  //           for (let i = 0; i < signID.length; i++) {
  //             signatories.push(signID[i].signID);
  //           }
  //           for (let i = 0; i < signatories.length; i++) {
  //             const q = `INSERT INTO hd_clearance
  //             (HDClearance_adminNote,
  //               HDClearance_dateUpdated,
  //               HDClearance_signatoriesID,
  //               HDClearance_hdRequestID) VALUES(?,?,?,?)`;
  //             count = signatories.length;
  //             db.query(
  //               //fifth query
  //               q,
  //               ["PENDING", date, signatories[i], reqID],
  //               (err, response) => {
  //                 if (err) return console.log(err);
  //               }
  //             );
  //           }
  //           if (count === signatories.length) {
  //             const q = `UPDATE hd_request SET HD_adminNote =? WHERE HD_ID = ? AND HD_studentID=?`;
  //             db.query(q, ["PENDING", reqID, studID], (err, data) => {
  //               //sixth query
  //               if (err) return console.log(err);
  //               res.status(200).json("Request Updated");
  //             });
  //           }
  //         });
  //       });
  //     });
  //   });
  // });
};

export const validateRequestWDF = (req, res) => {
  // const token = req.session.admin;
  // const signatories = [];
  // const adminRoleId = [];
  // const reqID = req.params.id;
  // const date = new Date();
  // let count;
  // if (!token) return res.status(401).json("Not Authenticated");
  // jwt.verify(token, "admin_jwtkey", (err, userInfo) => {
  //   if (err) return res.status(403).json("User not valid");
  //   const q =
  //     "SELECT WDF_studentID,WDF_documentID FROM wdf_request WHERE WDF_ID = ?";
  //   db.query(q, [reqID], (err, result) => {
  //     //first query
  //     if (err) return res.status(404).json("Request not Found !");
  //     const studID = result[0].WDF_studentID;
  //     const docsID = result[0].WDF_documentID;
  //     const q = `SELECT Course_departmentID as depID from courses
  //       INNER JOIN student_form
  //       ON Student_courseID = Course_ID
  //       WHERE Student_ID = ?`;
  //     db.query(q, [studID], (err, depID) => {
  //       //second query
  //       if (err) return console.log(err);
  //       const departmentID = depID[0].depID;
  //       const q = `SELECT Signatories_ID as signID,
  //       Signatories_adminRoleID as adminRole
  //       FROM signatories
  //       WHERE Signatories_departmentID = ?
  //       AND Signatories_documentID = ?`;
  //       db.query(q, [departmentID, docsID], (err, signatory) => {
  //         //third query
  //         if (err) return console.log(err);
  //         for (let i = 0; i < signatory.length; i++) {
  //           signatories.push(signatory[i].signID);
  //           adminRoleId.push(signatory[i].adminRole);
  //         }
  //         const q = `SELECT Signatories_ID as signID
  //         FROM signatories
  //         WHERE Signatories_documentID = ?
  //         AND Signatories_adminRoleID NOT IN (?)`;
  //         db.query(q, [docsID, adminRoleId], (err, signID) => {
  //           //fourth query
  //           if (err) return console.log(err);
  //           for (let i = 0; i < signID.length; i++) {
  //             signatories.push(signID[i].signID);
  //           }
  //           for (let i = 0; i < signatories.length; i++) {
  //             const q = `INSERT INTO wdf_clearance
  //             (WDFClearance_adminNote,
  //               WDFClearance_dateUpdated,
  //               WDFClearance_signatoriesID,
  //               WDFClearance_wdfRequestID) VALUES(?,?,?,?)`;
  //             count = signatories.length;
  //             db.query(
  //               //fifth query
  //               q,
  //               ["PENDING", date, signatories[i], reqID],
  //               (err, response) => {
  //                 if (err) return console.log(err);
  //               }
  //             );
  //           }
  //           if (count === signatories.length) {
  //             const q = `UPDATE wdf_request SET WDF_adminNote =? WHERE WDF_ID = ? AND WDF_studentID=?`;
  //             db.query(q, ["PENDING", reqID, studID], (err, data) => {
  //               //sixth query
  //               if (err) return console.log(err);
  //               res.status(200).json("Request Updated");
  //             });
  //           }
  //         });
  //       });
  //     });
  //   });
  // });
};

export const holdApprovedRequest = (req, res) => {
  const token = req.session.admin;
  const id = req.params.id;
  const message = req.body.message;
  const releaseDate = req.body.releaseDate;
  const date = new Date();
  const note = req.body.note;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "admin_jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");

    if (note) {
      const q = `UPDATE requests SET Request_adminNote = ? ,Request_dateApproved=?WHERE Request_ID = ?`;
      db.query(q, [note, date, id], (err, result) => {
        if (err) return console.log(err);

        if (message) {
          const q =
            "INSERT INTO messages (Message_Text,Message_Date,Message_requestID) VALUES(?)";
          const values = [message, date, id];
          db.query(q, [values], (err, success) => {
            if (err) return console.log(err);
          });
        }
      });
    }
    if (releaseDate) {
      const date = new Date(releaseDate);
      const utcDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      );
      const formattedDate = utcDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const q =
        "UPDATE requests SET Request_releaseDate = ? WHERE Request_ID = ?";

      db.query(q, [formattedDate, id], (err, dateAdded) => {
        if (err) return console.log(err);
      });
    }
    res.json("Request Updated");
  });
};
