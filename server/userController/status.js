import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const pending = (req, res) => {
    const token = req.session.user;
    if (!token) return res.status(401).json("Not Authenticated");
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) return res.status(403).json("User not valid");
      // const q = `SELECT t1.adminNote as note,  SUM(t1.count) as total_requests
      // FROM (
      //     SELECT Request_Approval as adminNote, COUNT(*) as count FROM requests INNER JOIN student_form ON Request_studentID = Student_ID WHERE  Student_userID = ? GROUP BY Request_Approval
      //     UNION ALL
      //     SELECT WDF_adminNote as adminNote, COUNT(*) as count FROM wdf_request INNER JOIN student_form ON WDF_studentID = Student_ID  WHERE  Student_userID = ? GROUP BY WDF_adminNote
      //     UNION ALL
      //     SELECT HD_adminNote as adminNote, COUNT(*) as count FROM hd_request INNER JOIN student_form ON HD_studentID = Student_ID WHERE  Student_userID = ? GROUP BY HD_adminNote
      // ) t1
      // GROUP BY t1.adminNote`
      
      const q = `SELECT Request_adminNote as note, COUNT(*) as total_requests FROM requests INNER JOIN student_form ON Request_studentID = Student_ID WHERE  Student_userID = ? GROUP BY Request_adminNote`;
      db.query(q, [userInfo.id, userInfo.id, userInfo.id], (err, response) => {
        if (err) return console.log(err);
        res.send(response);
      });
    });
  };
  export const monthly = (req, res) => {
  //   const userID = req.body.userID;
  //   const q = `SELECT MONTHNAME(Request_Date) as month,
  //                     DAY(Request_Date) as day,
  //                     YEAR(Request_date) as Year,
  //                     COUNT(*) as count FROM requests LEFT JOIN student_form ON Request_studentID = Student_ID WHERE Student_userID =?
  //                     GROUP BY MONTH(Request_Date), DAY(Request_Date)`;
  //   // const q = `SELECT MONTHNAME(Request_Date) as date,COUNT(*) as userNumber FROM requests
  //   // LEFT JOIN students ON Request_studentID = Student_ID WHERE Student_userID = ?
  //   //  GROUP BY MONTH(Request_Date) ORDER BY userNumber DESC`;
  //   db.query(q, [userID], (err, result) => {
  //     if (err) return res.json(err);
  //     if (!result.length) return res.send("0");
  //     res.send(result);
  //   });
};

export const courses = (req, res) => {
  db.query(
    "SELECT Course_ID, Course_Description FROM courses",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
};

export const profile = (req, res) => {
  const q = `SELECT 
  Student_ID,Student_schoolID,
  Student_Semester as semester,
  Student_firstName,
  Student_lastName,
  Student_middleName,
  Student_currentAddress,
  Student_phoneNumber,
  Student_yearLevel,
  Student_lastSchoolYearAttended,
  Student_enrollmentStatus,
  User_emailAddress as email,
  Course_Description AS course 
  FROM students 
  INNER JOIN courses 
  ON Student_courseID = Course_ID 
  INNER JOIN users 
  ON Student_userID = User_ID 
  WHERE Student_userID = ?`;

  // const q = "SELECT * FROM students WHERE Student_userID=?";
  db.query(q, [req.params.id], (err, result) => {
    if (err) return console.log(err);

    if (!result.length) return res.send("");

    res.send(result);
  });
};

export const getUserProfile = (req, res) => {
  const token = req.session.user;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");

    const q = `SELECT User_Username as username,
     User_emailAddress as email , 
     User_Password as password 
     from users 
     WHERE User_ID = ?`;

    db.query(q, [userInfo.id], (err, result) => {
      if (err) return console.log(err);

      res.send(result);
    });
  });
};
