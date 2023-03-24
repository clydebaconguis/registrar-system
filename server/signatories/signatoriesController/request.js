import { db } from "../../db.js";
import jwt from "jsonwebtoken";
import { response } from "express";

export const getAllRequestCFRD = (req, res) => {
  const token = req.session.signatories;
  const documentID = [1, 2, 3];
  const signatoriesID = [];
  const field = documentID.map(() => "?").join(",");
  const data = [];
  if (!token) return res.status(401).json("Not Authenticated");

  jwt.verify(token, "signatories_jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const q = `SELECT Admin_roleID as roleID, Admin_departmentID as departmentID FROM admin_profile WHERE Admin_userID = ?`;
    db.query(q, [userInfo.id], (err, adminRoleID) => {
      if (err) return console.log(err);
      const roleID = adminRoleID[0].roleID;
      const depID = adminRoleID[0].departmentID;
      const q = `SELECT Signatories_ID as id
      FROM signatories  
      WHERE Signatories_adminRoleID = ? 
      AND Signatories_departmentID = ? 
      AND Signatories_documentID IN (?)
      GROUP BY Signatories_documentID 
      ORDER BY FIELD(Signatories_documentID, ${field})`;

      db.query(q, [roleID, depID, documentID, ...documentID], (err, result) => {
        if (err) return console.log(err);
        for (let i = 0; i < result.length; i++) {
          signatoriesID.push(result[i].id);
        }

        // if (signatoriesID.length === 1) {
        //   const count1 = [300, 300];

        //   signatoriesID.push(count1);
        // } else if (signatoriesID.length === 2) {
        //   const count1 = [300];

        //   signatoriesID.push(count1);
        // }
        const q = `SELECT Clearance_ID as id,
        Student_firstName as fname,
        Student_lastName as lname,
        Student_middleName as mname,
        Student_schoolID as schoolID,
        Student_currentAddress as address,
        Student_phoneNumber as phoneNumber, 
        Student_yearLevel as yearLevel, 
        Student_semester as semester,
        Student_lastSchoolYearAttended as schoolYear,
        Student_enrollmentStatus as status,
        Student_userID as user_ID,
        Student_emailAddress as email,
        Course_Description as course, 
        Course_Code as courseCode,
        DATE_FORMAT(Clearance_dateUpdated,  ' %M %d %Y %r') as approveDate,
        DATE_FORMAT(Clearance_dateUpdated, ' %M %d %Y %r') as requestDate,
        CFRD_Certificates as certificates,
        CFRD_imageUrl as image,
        Department_Description as Departments,
        Clearance_adminNote as approvals,
        Clearance_adminNote as approval,
        Document_Title as document,
        Role_Description as departmentCode, 
        Purpose_Description as purpose
        from clearance
        INNER JOIN requests
        ON Clearance_requestID = Request_ID
        INNER JOIN student_form ON Request_studentID = Student_ID
        INNER JOIN courses ON Student_courseID = Course_ID
        INNER JOIN documents ON Request_documentID = Document_ID
        INNER JOIN tor_purpose ON Purpose_requestID = Request_ID
        INNER JOIN signatories ON Clearance_signatoriesID = Signatories_ID
        INNER JOIN cfrd_requirements ON CFRD_requestID = Request_ID
        INNER JOIN admin_role ON Signatories_adminRoleID = Role_ID
        INNER JOIN departments ON Signatories_departmentID = Department_ID 
        WHERE Clearance_signatoriesID in (?)
        GROUP BY Clearance_ID`;

        db.query(q, [signatoriesID], (err, result) => {
          if (err) return console.log(err);
          data.push(result);

          const q = `SELECT Clearance_ID as id,
          Student_firstName as fname,
          Student_lastName as lname,
          Student_middleName as mname,
          Student_schoolID as schoolID,
          Student_currentAddress as address,
          Student_phoneNumber as phoneNumber, 
          Student_yearLevel as yearLevel, 
          Student_semester as semester,
          Student_lastSchoolYearAttended as schoolYear,
          Student_enrollmentStatus as status,
          Student_userID as user_ID,
          Student_emailAddress as email,
          Course_Description as course, 
          Course_Code as courseCode,
          DATE_FORMAT(Clearance_dateUpdated,  ' %M %d %Y %r')  as approveDate,
          DATE_FORMAT(Clearance_dateUpdated, ' %M %d %Y %r') as requestDate,
          CFRD_Certificates as certificates,
          CFRD_imageUrl as image,
          Department_Description as Departments,
          Clearance_adminNote as approvals,
          Clearance_adminNote as approval,
          Document_Title as document,
          Role_Description as departmentCode
          from clearance
          INNER JOIN requests ON Clearance_requestID = Request_ID
          INNER JOIN student_form ON Request_studentID = Student_ID
          INNER JOIN courses ON Student_courseID = Course_ID
          INNER JOIN documents ON Request_documentID = Document_ID
          INNER JOIN signatories ON Clearance_signatoriesID = Signatories_ID
          INNER JOIN cfrd_requirements ON CFRD_requestID = Request_ID
          INNER JOIN admin_role ON Signatories_adminRoleID = Role_ID
          INNER JOIN departments ON Signatories_departmentID = Department_ID 
          WHERE Clearance_signatoriesID in (?)
          GROUP BY Clearance_ID`;
          db.query(q, [signatoriesID], (err, response) => {
            if (err) return console.log(err);
            data.push(response);
            res.send(data);
          });
        });
      });
    });
  });
};

export const validateRequestTor = (req, res) => {
  const token = req.session.signatories;
  const reqID = req.params.id;
  const adminNote = req.body.adminNote;
  const date = new Date();
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "signatories_jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");

    const q = `SELECT Clearance_signatoriesID as Admin_ID FROM clearance WHERE Clearance_ID = ?`;

    db.query(q, [reqID], (err, result) => {
      if (err) return console.log(err);
      const adminID = result[0].Admin_ID;
      const q = `UPDATE clearance SET 
      Clearance_adminNote = ?, 
      Clearance_dateUpdated=? 
      WHERE Clearance_signatoriesID = ? 
      AND Clearance_ID = ?`;
      const values = [adminNote, date, adminID, reqID];
      db.query(q, values, (err, response) => {
        if (err) return console.log(err);

        res.send(`THIS REQUEST IS ${adminNote}`);
      });
    });
  });
};

export const getAllRequestHD = (req, res) => {
  const token = req.session.signatories;
  const documentID = 3;

  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "signatories_jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const q = `SELECT Admin_roleID as roleID, Admin_departmentID as departmentID FROM admin_profile WHERE Admin_userID = ?`;
    db.query(q, [userInfo.id], (err, adminRoleID) => {
      if (err) return console.log(err);
      const roleID = adminRoleID[0].roleID;
      const depID = adminRoleID[0].departmentID;
      const q = `SELECT Signatories_ID as id
      FROM signatories  
      WHERE Signatories_adminRoleID = ? 
      AND Signatories_departmentID = ? 
      AND Signatories_documentID = ?
      GROUP BY Signatories_documentID 
   `;

      db.query(q, [roleID, depID, documentID], (err, result) => {
        if (err) return console.log(err);

        const signatoriesID = result[0].id;

        const q = `SELECT Clearance_ID as id,
        Student_firstName as fname,
        Student_lastName as lname,
        Student_middleName as mname,
        Student_schoolID as schoolID,
        Student_currentAddress as address,
        Student_phoneNumber as phoneNumber, 
        Student_yearLevel as yearLevel, 
        Student_semester as semester,
        Student_lastSchoolYearAttended as schoolYear,
        Student_enrollmentStatus as status,
        Student_userID as user_ID,
        Student_emailAddress as email,
        Course_Description as course, 
        Course_Code as courseCode,
        DATE_FORMAT(Clearance_dateUpdated, ' %M %d %Y %r') as requestDate,
        DATE_FORMAT(Clearance_dateUpdated,  ' %M %d %Y %r') as approveDate,
        Role_Description as departmentCode, 
        HD_semester as semesterTransfer,
        Clearance_adminNote as approvals,
        Clearance_adminNote as approval,
        HD_schoolYear as year,
        HD_schoolToTransfer as school,
        HD_studentRemarks as studentRemarks,
        Document_Title as document
        FROM clearance
        INNER JOIN requests ON Clearance_requestID = Request_ID
        INNER JOIN student_form ON Request_studentID = Student_ID
        INNER JOIN courses ON Student_courseID = Course_ID
        INNER JOIN documents ON Request_documentID = Document_ID
        INNER JOIN signatories ON Clearance_signatoriesID = Signatories_ID
        INNER JOIN hd_requirements ON HD_requestID = Request_ID
        INNER JOIN admin_role ON Signatories_adminRoleID = Role_ID
        INNER JOIN departments ON Signatories_departmentID = Department_ID
        WHERE Clearance_signatoriesID = ?
        GROUP BY Clearance_ID`;
        db.query(q, [signatoriesID], (err, respond) => {
          if (err) return console.log(err);
          res.send(respond);
        });
      });
    });
  });
};

export const validateRequestHD = (req, res) => {
  const token = req.session.signatories;
  const reqID = req.params.id;
  const adminNote = req.body.adminNote;
  const date = new Date();
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "signatories_jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const q = `SELECT HDClearance_signatoriesID as Admin_ID FROM hd_clearance WHERE HDClearance_ID = ?`;
    db.query(q, [reqID], (err, result) => {
      if (err) return console.log(err);
      const adminID = result[0].Admin_ID;
      const q = `UPDATE hd_clearance SET 
      HDClearance_adminNote = ?, 
      HDClearance_dateUpdated=? 
      WHERE HDClearance_signatoriesID = ? 
      AND HDClearance_ID = ?`;
      const values = [adminNote, date, adminID, reqID];
      db.query(q, values, (err, response) => {
        if (err) return console.log(err);

        res.send(`THIS REQUEST IS ${adminNote}`);
      });
    });
  });
};

export const getAllRequestWDF = (req, res) => {
  // const token = req.session.signatories;
  // const documentID = [1, 2, 3];
  // const signatoriesID = [];
  // const field = documentID.map(() => "?").join(",");
  // if (!token) return res.status(401).json("Not Authenticated");
  // jwt.verify(token, "signatories_jwtkey", (err, userInfo) => {
  //   if (err) return res.status(403).json("User not valid");
  //   const q = `SELECT Admin_roleID as roleID, Admin_departmentID as departmentID FROM admin_profile WHERE Admin_userID = ?`;
  //   db.query(q, [userInfo.id], (err, adminRoleID) => {
  //     if (err) return console.log(err);
  //     const roleID = adminRoleID[0].roleID;
  //     const depID = adminRoleID[0].departmentID;
  //     const q = `SELECT Signatories_ID as id
  //     FROM signatories
  //     WHERE Signatories_adminRoleID = ?
  //     AND Signatories_departmentID = ?
  //     AND Signatories_documentID IN (?)
  //     GROUP BY Signatories_documentID
  //     ORDER BY FIELD(Signatories_documentID, ${field})`;
  //     db.query(q, [roleID, depID, documentID, ...documentID], (err, result) => {
  //       if (err) return console.log(err);
  //       for (let i = 0; i < result.length; i++) {
  //         signatoriesID.push(result[i].id);
  //       }
  //       // if (signatoriesID.length === 1) {
  //       //   const count1 = [300, 300];
  //       //   signatoriesID.push(count1);
  //       // } else if (signatoriesID.length === 2) {
  //       //   const count1 = [300];
  //       //   signatoriesID.push(count1);
  //       // }
  //       const q = `SELECT WDFClearance_ID as id,
  //       Student_userID as user_ID,
  //         Student_firstName as fname,
  //         Student_lastName as lname,
  //         Student_MiddleName as mname,
  //         Student_schoolID as schoolID,
  //         Student_currentAddress as address,
  //         Student_phoneNumber as phoneNumber,
  //         Student_yearLevel as yearLevel,
  //         Student_semester as semester,
  //         Student_emailAddress as email,
  //         Student_lastSchoolYearAttended 	as schoolYear,
  //         Student_enrollmentStatus as status,
  //         Course_Code as courseCode,
  //         Course_Description as course,
  //         DATE_FORMAT(WDF_requestDate, ' %M %d %Y %r') as requestDate,
  //         DATE_FORMAT(WDFClearance_dateUpdated, ' %M %d %Y %r' ) as dateUpdated,
  //         Role_Description as departmentCode,
  //         WDF_withdrawThisSemester as semesterTransfer,
  //         WDFClearance_adminNote as approvals,
  //         WDF_schoolYear as year,
  //         WDF_units as units,
  //         WDF_studentRemarks as studentRemarks,
  //         WDF_interviewerRemarks as interviewerRemarks,
  //         Document_Title as document
  //         FROM wdf_clearance
  //         INNER JOIN wdf_request ON WdfClearance_wdfRequestID = WDF_ID
  //         INNER JOIN documents ON WDF_documentID = Document_ID
  //         INNER JOIN student_form ON WDF_studentID = Student_ID
  //         INNER JOIN courses ON Student_courseID = Course_ID
  //         INNER JOIN signatories ON WDFClearance_signatoriesID = Signatories_ID
  //         INNER JOIN admin_role ON Signatories_adminRoleID = Role_ID
  //         INNER JOIN departments ON Signatories_departmentID = Department_ID
  //         WHERE WDFClearance_signatoriesID IN (?)
  //         GROUP BY WDFClearance_ID`;
  //       db.query(q, [signatoriesID], (err, respond) => {
  //         if (err) return console.log(err);
  //         res.send(respond);
  //       });
  //     });
  //   });
  // });
};

export const validateRequestWDF = (req, res) => {
  const token = req.session.signatories;
  const reqID = req.params.id;
  const adminNote = req.body.adminNote;

  const date = new Date();
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "signatories_jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const q = `SELECT WDFClearance_signatoriesID as Admin_ID FROM wdf_clearance WHERE WDFClearance_ID = ?`;
    db.query(q, [reqID], (err, result) => {
      if (err) return console.log(err);
      const adminID = result[0].Admin_ID;
      const q = `UPDATE wdf_clearance SET 
      WDFClearance_adminNote = ?, 
      WDFClearance_dateUpdated=? 
      WHERE WDFClearance_signatoriesID = ? 
      AND WDFClearance_ID = ?`;

      const values = [adminNote, date, adminID, reqID];
      db.query(q, values, (err, response) => {
        if (err) return console.log(err);

        res.send(`THIS REQUEST IS ${adminNote}`);
      });
    });
  });
};
