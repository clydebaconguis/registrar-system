import { db } from "../../db.js";
import jwt from "jsonwebtoken";

const countAllTheDocumentRequest = (values) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT COUNT(*) as total FROM requests WHERE Request_documentID = ? AND Request_adminNote !=?`;
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

export const countAllRequest = (req, res) => {
  const token = req.session.superadmin;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "superadmin_jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");

    try {
      const values = [1, "VALIDATING"];
      const values2 = [3, "VALIDATING"];
      const countAllOfDocument1 = await countAllTheDocumentRequest(values);
      const countAllOfDocument3 = await countAllTheDocumentRequest(values2);
      const theResultOfCounting = [
        countAllOfDocument1[0].total,
        countAllOfDocument3[0].total,
      ];

      return res.status(200).json({
        totalForCfrd: theResultOfCounting[0],
        totalForHd: theResultOfCounting[1],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("something went wrong");
    }
  });
};

const countRequests = (values, query) => {
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

const functionWithoutQuery = (query) => {
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

export const countAllDailyMonthlyYearlyRequest = (req, res) => {
  const token = req.session.superadmin;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "superadmin_jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const queryForDaily = `SELECT MONTHNAME(t1.request_date) as date,
    DAY(t1.request_date) as day, 
    YEAR(t1.request_date) as year,
     SUM(t1.count) as total_requests
    FROM (
      SELECT Request_Date as request_date, Request_documentID as DocumentType,
      COUNT(*) as count
      FROM requests
      WHERE Request_Date IS NOT NULL 
      AND Request_adminNote !=?
      GROUP BY DATE(Request_Date)
    ) as t1
    GROUP BY DATE(t1.request_date)
    ORDER BY t1.request_date ASC`;

    const queryForMonthly = `SELECT MONTHNAME(t1.request_date) as date, 
    YEAR(t1.request_date) as year, 
     SUM(t1.count) as total_requests
    FROM (
      SELECT Request_Date as request_date, Request_documentID as DocumentType,
       COUNT(*) as count
        FROM requests
         WHERE Request_Date IS NOT NULL
          AND Request_adminNote !=? 
          GROUP BY MONTH(Request_Date)
    ) t1
    GROUP BY MONTH(t1.request_date)`;
    const queryForYearly = `SELECT YEAR(t1.request_date) as year, 
    SUM(t1.count) as total_requests
   FROM (
     SELECT Request_Date as request_date, Request_documentID as DocumentType,
      COUNT(*) as count
       FROM requests
        WHERE Request_Date IS NOT NULL
         AND Request_adminNote !=?
          GROUP BY MONTH(Request_Date)
) t1
   GROUP BY YEAR(t1.request_date)`;

    try {
      const values = ["VALIDATING"];
      const dailyRequest = await countRequests(values, queryForDaily);
      const monthlyRequest = await countRequests(values, queryForMonthly);
      const yearlyRequest = await countRequests(values, queryForYearly);
      const allTheCount = [dailyRequest, monthlyRequest, yearlyRequest];
      return res.status(200).json(allTheCount);
    } catch (error) {
      console.log(err);
      res.status(500).json("something went wrong");
    }
  });
};

export const countAllRequestPerDocument = (req, res) => {
  const token = req.session.superadmin;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "superadmin_jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const queryForDaily = `SELECT MONTHNAME(t1.request_date) as date,
    DAY(t1.request_date) as day, 
    YEAR(t1.request_date) as year,
     SUM(t1.count) as total_requests
    FROM (
      SELECT Request_Date as request_date, 
      COUNT(*) as count
      FROM requests
      WHERE Request_Date IS NOT NULL 
      AND Request_adminNote != ?
      AND Request_documentID = ?
      GROUP BY DATE(Request_Date)
    ) as t1
    GROUP BY DATE(t1.request_date)
    ORDER BY t1.request_date ASC`;
    const queryForMonthly = `SELECT MONTHNAME(t1.request_date) as date, 
    YEAR(t1.request_date) as year, 
     SUM(t1.count) as total_requests
    FROM (
      SELECT Request_Date as request_date,
       COUNT(*) as count
        FROM requests
         WHERE Request_Date IS NOT NULL
         AND Request_adminNote != ?
         AND Request_documentID = ?
          GROUP BY MONTH(Request_Date)
    ) t1
    GROUP BY MONTH(t1.request_date)`;

    const queryForYearly = `SELECT YEAR(t1.request_date) as year, 
      SUM(t1.count) as total_requests
     FROM (
       SELECT Request_Date as request_date,
        COUNT(*) as count
         FROM requests
          WHERE Request_Date IS NOT NULL
          AND Request_adminNote != ?
          AND Request_documentID = ?
            GROUP BY MONTH(Request_Date)
  ) t1`;

    try {
      const values = ["VALIDATING", 1];

      const values3 = ["VALIDATING", 3];

      const dailyRequest = await countRequests(values, queryForDaily);
      const monthlyRequest = await countRequests(values, queryForMonthly);
      const yearlyRequest = await countRequests(values, queryForYearly);
      const dailyRequest1 = await countRequests(values3, queryForDaily);
      const monthlyRequest1 = await countRequests(values3, queryForMonthly);
      const yearlyRequest1 = await countRequests(values3, queryForYearly);

      const allTheCount = [
        dailyRequest,
        monthlyRequest,
        yearlyRequest,
        dailyRequest1,
        monthlyRequest1,
        yearlyRequest1,
      ];
      return res.status(200).json(allTheCount);
    } catch (error) {
      console.log(error);
      res.status(500).json("something went wrong");
    }
  });
};

export const getAllAdminUser = (req, res) => {
  const token = req.session.superadmin;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "superadmin_jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const q = `SELECT
    Admin_ID as id ,
      Admin_firstName AS fname,
      Admin_lastName AS lname,
      Admin_middleName AS mname,
      Department_Description AS department,
      Role_Description AS adminRole,
    User_username as users
  FROM
      admin_profile
  INNER JOIN departments ON Admin_departmentID = Department_ID
  INNER JOIN admin_role ON Admin_roleID = Role_ID
  INNER JOIN users ON Admin_userID = User_ID;`;
    try {
      const allData = await functionWithoutQuery(q);
      res.status(200).json(allData);
    } catch (error) {
      console.log(error);
      res.status(500).json("something went wrong");
    }
  });
};
