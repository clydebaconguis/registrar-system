import { db } from "../../db.js";
import jwt, { verify } from "jsonwebtoken";
import { response } from "express";
import { cloudinary } from "../../utils/cloudinary.js";

const getAllCfrdRequest = (values, query) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(result);
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
    const values = [["APPROVED", "PENDING"], "APPROVED", "APPROVED"];
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
  const token = req.session.superadmin;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "superadmin_jwtkey", async (err, userInfo) => {
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
  WHERE Request_adminNote != ?
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
  WHERE req.Request_adminNote != ?
  GROUP BY req.Request_ID`;
    try {
      await approveAllRequest();
      const values = ["VALIDATING"];
      const dataOfValidatingCfrdRequest = await getAllCfrdRequest(
        values,
        queryForGettingTheValidatingRequest
      );
      const dataOfValidatedCfrdRequest = await getAllCfrdRequest(
        values,
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

export const getAllHdRequest = (req, res) => {
  const token = req.session.superadmin;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "superadmin_jwtkey", async (err, userInfo) => {
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
  WHERE Request_documentID = ? AND Request_adminNote !=?
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
  WHERE Request_documentID = ? AND Request_adminNote !=?
  GROUP BY Request_ID;`;
    try {
      await approveAllRequest();
      console.log(response);
      const values = [1, "VALIDATING"];
      const values1 = [3, "VALIDATING"];
      const dataOfValidatingCfrdRequest = await getAllCfrdRequest(
        values,
        queryForGettingTheValidatingRequest
      );
      const dataOfValidatedCfrdRequest = await getAllCfrdRequest(
        values1,
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

const functionWithQueryOnly = (query) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, response) => {
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
export const updateRequest = (req, res) => {
  const token = req.session.superadmin;
  const reqID = req.params.id;
  const note = req.body.note;
  const date = new Date();
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "superadmin_jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");

    const queryForLookingTheRequestInClearance = ` SELECT * FROM clearance WHERE Clearance_requestID = ?`;
    const queryForUpdatingTheClearance = ` UPDATE clearance SET Clearance_adminNote = ? ,Clearance_dateUpdated =? WHERE Clearance_requestID = ? AND Clearance_adminNote =?`;
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
  });
};

export const holdApprovedRequest = (req, res) => {
  const token = req.session.superadmin;
  const id = req.params.id;
  const message = req.body.message;
  const releaseDate = req.body.releaseDate;
  const date = new Date();
  const note = req.body.note;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "superadmin_jwtkey", (err, userInfo) => {
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

export const getAdminRoleAndDepartments = (req, res) => {
  const token = req.session.superadmin;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "superadmin_jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const queryForAdminRole = `SELECT Role_ID as id , Role_Description as description FROM admin_role`;
    const queryForDepartment = `SELECT Department_ID as id, Department_Description as description FROM departments`;

    try {
      const admin_role = await functionWithQueryOnly(queryForAdminRole);
      const departments = await functionWithQueryOnly(queryForDepartment);

      const allData = [admin_role, departments];
      return res.status(200).json(allData);
    } catch (error) {
      console.log(error);
      res.status(500).json("something went wrong");
    }
  });
};
