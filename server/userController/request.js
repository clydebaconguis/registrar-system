import { db } from "../db.js";
import jwt, { verify } from "jsonwebtoken";
import { cloudinary } from "../utils/cloudinary.js";

const checkIfHaveUserProfile = (id) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT * FROM students WHERE Student_userID = ?`;
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

const insertIntoStudents = (values) => {
  return new Promise((resolve, reject) => {
    const q = `INSERT INTO students
    ( Student_schoolID,
      Student_firstName, Student_lastName,
      Student_middleName, Student_currentAddress,
      Student_phoneNumber, Student_yearLevel,
      Student_Semester, Student_lastSchoolYearAttended,
      Student_enrollmentStatus, Student_courseID, 
       Student_userID) VALUES(?)`;
    db.query(q, [values], (err, response) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(response);
      }
    });
  });
};

const insertStudentForm = (values) => {
  return new Promise((resolve, reject) => {
    const q = `INSERT INTO student_form
      ( Student_schoolID,
        Student_firstName, Student_lastName,
        Student_middleName, Student_currentAddress,
        Student_phoneNumber, Student_yearLevel,
        Student_Semester, Student_lastSchoolYearAttended,
        Student_enrollmentStatus, Student_courseID, 
        Student_emailAddress, Student_userID) VALUES(?)`;
    db.query(q, [values], (err, response) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(response.insertId);
      }
    });
  });
};

const departmentID = (values) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT Course_departmentID as depID from courses
    RIGHT JOIN student_form ON Student_courseID = Course_ID
    WHERE Student_ID = ?`;
    db.query(q, [values], (err, response) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(response[0].depID);
      }
    });
  });
};

const signatoriesID = (values) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT Signatories_ID as id FROM signatories 
    WHERE Signatories_adminRoleID = ?
    and Signatories_departmentID = ?
    and Signatories_documentID = ?`;
    db.query(q, values, (err, response) => {
      if (err) {
        return reject(err);
      }
      {
        if (response.length > 0) {
          return resolve(response[0].id);
        } else {
          return resolve(0);
        }
      }
    });
  });
};

const insertIntoRequest = (values) => {
  return new Promise((resolve, reject) => {
    const q = `INSERT INTO requests 
    (Request_Date,
    Request_documentID,
    Request_studentID,
    Request_signatoriesID) VALUES(?)`;
    db.query(q, [values], (err, response) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(response.insertId);
      }
    });
  });
};

const insertIntoCfrdRequirements = (values) => {
  return new Promise((resolve, reject) => {
    const q = `INSERT INTO cfrd_requirements (CFRD_Certificates,CFRD_imageUrl,CFRD_requestID) VALUES(?)`;
    db.query(q, [values], (err) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve();
      }
    });
  });
};

const insertIntoPurpose = (values) => {
  return new Promise((resolve, reject) => {
    const q = `INSERT INTO tor_purpose (Purpose_Description,Purpose_requestID) VALUES(?)`;
    db.query(q, [values], (err) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve();
      }
    });
  });
};

const insertIntoHdRequirements = (values) => {
  return new Promise((resolve, reject) => {
    const q = `INSERT INTO hd_requirements(
      HD_Semester,
      HD_schoolYear,
      HD_schoolToTransfer,
      HD_studentRemarks,
      HD_requestID) VALUES(?)`;
    db.query(q, [values], (err) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve();
      }
    });
  });
};

const insertImageIntoCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(file, { upload_preset: "my_pictures" })
      .then((result) => resolve(result.public_id))
      .catch((error) => reject(error));
  });
};

export const addRequest = async (req, res) => {
  const token = req.session.user;
  const student = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    middlename: req.body.middlename,
    schoolId: req.body.schoolId,
    email: req.body.email,
    currentAddress: req.body.currentAddress,
    phoneNumber: req.body.phoneNumber,
    yearlevel: req.body.yearlevel,
    course: req.body.course,
    enrollmentStatus: req.body.enrollmentStatus,
    lastSchoolYearAttended: req.body.lastSchoolYearAttended,
    semesters: req.body.semesters,
  };
  const requestCFRD = {
    User_ID: req.body.User_ID,
    purpose: req.body.purpose,
    certificates: req.body.certificates,
    document_ID: req.body.document_ID,
    file: req.body.file,
  };
  const requestHD = {
    semester: req.body.semester,
    schoolToTransfer: req.body.schoolToTransfer,
    lastSchoolYear: req.body.lastSchoolYear,
    studentRemarks: req.body.studentRemarks,
  };
  const date = new Date();
  if (!token) return res.status(401).json("Not Authenticated");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    console.log(userInfo.id);
    if (err) return res.status(403).json("User not valid");
    const values = [
      student.schoolId,
      student.firstname,
      student.lastname,
      student.middlename,
      student.currentAddress,
      student.phoneNumber,
      student.yearlevel,
      student.semesters,
      student.lastSchoolYearAttended,
      student.enrollmentStatus,
      student.course,
      student.email,
      userInfo.id,
    ];
    try {
      const theStudentCheckerId = await checkIfHaveUserProfile(userInfo.id);

      if (theStudentCheckerId.length === 0) {
        const values = [
          student.schoolId,
          student.firstname,
          student.lastname,
          student.middlename,
          student.currentAddress,
          student.phoneNumber,
          student.yearlevel,
          student.semesters,
          student.lastSchoolYearAttended,
          student.enrollmentStatus,
          student.course,
          userInfo.id,
        ];
        await insertIntoStudents(values);
      }
      const theStudentInsertedid = await insertStudentForm(values);
      const theDepartmentID = await departmentID(theStudentInsertedid);
      const valueForSignatoryID = [
        10,
        theDepartmentID,
        requestCFRD.document_ID,
      ];
      const theSignatoriesID = await signatoriesID(valueForSignatoryID);
      const valueForRequests = [
        date,
        requestCFRD.document_ID,
        theStudentInsertedid,
        theSignatoriesID,
      ];

      const theRequestID = await insertIntoRequest(valueForRequests);
      if (requestCFRD.purpose) {
        const values = [requestCFRD.purpose, theRequestID];
        await insertIntoPurpose(values);
      }
      if (requestCFRD.file) {
        const imageUrl = await insertImageIntoCloudinary(requestCFRD.file);
        const values = [requestCFRD.certificates, imageUrl, theRequestID];
        await insertIntoCfrdRequirements(values);
      }

      if (requestCFRD.document_ID === 3) {
        const values = [
          requestHD.semester,
          requestHD.lastSchoolYear,
          requestHD.schoolToTransfer,
          requestHD.studentRemarks,
          theRequestID,
        ];

        await insertIntoHdRequirements(values);
      }

      return res.status(200).json("Request Succesfull");
    } catch (err) {
      res.status(500).json("Request Unsuccesfull");
      return console.log(err);
    }
  });
};

const getAllValidatingRequestOfCFRD = (id) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT Request_ID as id, Student_userID as user_ID,
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
  WHERE Student_userID = ?
  GROUP BY Request_ID`;
    db.query(q, [id], (err, result) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(result);
      }
    });
  });
};

export const getRequestCfrdValidating = async (req, res) => {
  const token = req.session.user;

  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");

    try {
      const theStudentValidatingRequests = await getAllValidatingRequestOfCFRD(
        userInfo.id
      );

      return res.status(200).send(theStudentValidatingRequests);
    } catch (err) {
      console.log(err);
      return res.status(500).json("Error getting the requests");
    }
  });
};

const getAllValidatedRequestOfCfrd = (id) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT
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
WHERE std.Student_userID = ?
GROUP BY req.Request_ID`;
    db.query(q, [id], (err, result) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(result);
      }
    });
  });
};

export const getRequestAllValidatedRequestCFRD = (req, res) => {
  const token = req.session.user;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");

    try {
      const allValidatedRequest = await getAllValidatedRequestOfCfrd(
        userInfo.id
      );

      return res.status(200).json(allValidatedRequest);
    } catch (err) {
      console.log(err);
      return res.status(500).json("Error getting the requests");
    }
  });
};

const getAllRequestOfHd = (id, query) => {
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, response) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(response);
      }
    });
  });
};

export const getRequestHDValidating = (req, res) => {
  const token = req.session.user;

  const query = `SELECT Request_ID as id, Student_userID as user_ID,
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
WHERE Student_userID = ?
GROUP BY Request_ID`;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    try {
      const allHdRequest = await getAllRequestOfHd(userInfo.id, query);
      return res.status(200).json(allHdRequest);
    } catch (err) {
      console.log(err);
      return res.status(500).json("Error getting the requests");
    }
  });
};

export const getRequestHd = (req, res) => {
  const token = req.session.user;

  if (!token) return res.status(401).json("Not Authenticated");

  const query = `SELECT Request_ID as id, Student_userID as user_ID,
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
WHERE Student_userID = ?
GROUP BY Request_ID;`;

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");

    try {
      const allHdRequest = await getAllRequestOfHd(userInfo.id, query);
      res.status(200).send(allHdRequest);
    } catch (err) {
      console.log(err);
      return res.status(500).json("Error getting the requests");
    }
  });
};

export const deleteRequest = (req, res) => {
  res.json("from controller");
};

export const addProfile = (req, res) => {
  const token = req.session.user;
  const student = {
    schoolId: req.body.schoolId,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    middleName: req.body.middlename,
    currentAddress: req.body.currentAddress,
    phoneNumber: req.body.phoneNumber,
    yearlevel: req.body.yearlevel,
    semester: req.body.semester,
    lastSchoolYearAttended: req.body.lastSchoolYearAttended,
    enrollmentStatus: req.body.enrollmentStatus,
    course: req.body.course,
  };
  if (!token) return res.status(404).json("USER NOT VALIDATED");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(400).json("USER NOT AUTHENTICATED");
    //check if user exist
    const q = "SELECT Student_ID FROM students WHERE Student_userID = ?";
    db.query(q, [userInfo.id], (err, response) => {
      if (err) return console.log(err);
      if (response.length === 0) {
        const q = `INSERT INTO students
        (Student_schoolID,
         Student_firstName,
         Student_lastName,
         Student_middleName,
         Student_currentAddress,
         Student_phoneNumber,
         Student_yearLevel,
         Student_Semester,
         Student_lastSchoolYearAttended,
         Student_enrollmentStatus,
         Student_courseID,
         Student_userID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
          student.schoolId,
          student.firstName,
          student.lastName,
          student.middleName,
          student.currentAddress,
          student.phoneNumber,
          student.yearlevel,
          student.semester,
          student.lastSchoolYearAttended,
          student.enrollmentStatus,
          student.course,
          userInfo.id,
        ];
        db.query(q, values, (err, result) => {
          if (err) return console.log(err);
          res.send("profile successfully created");
        });
      } else {
        const q = `UPDATE students SET
        Student_schoolID = ?,
        Student_firstName = ?,
        Student_lastName = ?,
        Student_middleName = ?,
        Student_currentAddress = ?,
        Student_phoneNumber = ?,
        Student_yearLevel = ?,
        Student_Semester = ?,
        Student_lastSchoolYearAttended = ?,
        Student_enrollmentStatus = ?,
        Student_courseID = ?
        WHERE Student_userID = ?`;
        const values = [
          student.schoolId,
          student.firstName,
          student.lastName,
          student.middleName,
          student.currentAddress,
          student.phoneNumber,
          student.yearlevel,
          student.semester,
          student.lastSchoolYearAttended,
          student.enrollmentStatus,
          student.course,
          userInfo.id,
        ];
        db.query(q, values, (err, result) => {
          if (err) return console.log(err);
          res.send("profile successfully edited");
        });
      }
    });
  });
};
