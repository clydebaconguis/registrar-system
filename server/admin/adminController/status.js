import { db } from "../../db.js";
import jwt from "jsonwebtoken";

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

const countAllTheDocumentRequest = (values) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT COUNT(*) as total FROM requests WHERE Request_signatoriesID = ?`;
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
  const token = req.session.admin;
  if (!token) return res.status(401).json("Not Authenticated");

  jwt.verify(token, "admin_jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    try {
      const theRoleIdAndDepId = await getRoleIDandDepartmentID(userInfo.id); //getting the role id and department id of the admin user
      const RoleID = theRoleIdAndDepId[0].roleID; //the role id of admin user
      const DepID = theRoleIdAndDepId[0].depID; // the department id of admin user
      const valuesOfGettingSignatoryId = [RoleID, DepID, 1]; // values of getting the role id of admin user for document 1
      const valuesOfGettingSignatoryId3 = [RoleID, DepID, 3]; // values of getting the role id of admin user for document 3
      const theSignatoriesIdOfDocument1 = await getTheSignatoriesId(
        valuesOfGettingSignatoryId
      ); // the signatory id of the admin user for document 1
      const theSignatoriesIdOfDocument3 = await getTheSignatoriesId(
        valuesOfGettingSignatoryId3
      ); // the signatory id of the admin user for document 3
      const SignatoryIDOfDocument1 = theSignatoriesIdOfDocument1[0].id;
      const SignatoryIDOfDocument3 = theSignatoriesIdOfDocument3[0].id;

      const countAllOfDocument1 = await countAllTheDocumentRequest(
        SignatoryIDOfDocument1
      );

      const countAllOfDocument2 = await countAllTheDocumentRequest(
        SignatoryIDOfDocument3
      );

      const theResultOfCounting = [
        countAllOfDocument1[0].total,
        countAllOfDocument2[0].total,
      ];
      return res.status(200).json({
        totalForCfrd: theResultOfCounting[0],
        totalForHd: theResultOfCounting[1],
      });
    } catch (err) {
      console.log(err);
      res.status(500).json("something went wrong");
    }
  });
};

const countDailyRequest = (values, query) => {
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

const countMonthlyRequest = (values, query) => {
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

const countYearlyRequest = (values, query) => {
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
export const countAllDailyMonthlyYearlyRequest = (req, res) => {
  const token = req.session.admin;
  const documentID = [1, 3];
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "admin_jwtkey", async (err, userInfo) => {
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
      AND Request_signatoriesID IN (?)
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
          AND Request_signatoriesID IN (?) 
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
         AND Request_signatoriesID IN (?)
          GROUP BY MONTH(Request_Date)
) t1
   GROUP BY YEAR(t1.request_date)`;
    try {
      const theRoleIdAndDepId = await getRoleIDandDepartmentID(userInfo.id); //getting the role id and department id of the admin user
      const RoleID = theRoleIdAndDepId[0].roleID; //the role id of admin user
      const DepID = theRoleIdAndDepId[0].depID; // the department id of admin user
      const valuesOfGettingSignatoryId = [RoleID, DepID, documentID];
      const theSignatoriesIdOfDocument = await getTheSignatoriesId(
        valuesOfGettingSignatoryId
      );

      const theSignatoryId = [
        theSignatoriesIdOfDocument[0].id,
        theSignatoriesIdOfDocument[1].id,
      ];

      const values = [theSignatoryId];
      const dailyRequest = await countDailyRequest(values, queryForDaily);
      const monthlyRequest = await countMonthlyRequest(values, queryForMonthly);
      const yearlyRequest = await countYearlyRequest(values, queryForYearly);
      const allTheCount = [dailyRequest, monthlyRequest, yearlyRequest];

      return res.status(200).json(allTheCount);
    } catch (err) {
      console.log(err);
      res.status(500).json("something went wrong");
    }
  });
};

export const countAllRequestPerDocument = (req, res) => {
  const token = req.session.admin;
  const documentID = [1, 3];
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "admin_jwtkey", async (err, userInfo) => {
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
      AND Request_signatoriesID IN (?)
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
          AND Request_signatoriesID IN (?) 
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
         AND Request_signatoriesID IN (?)
         AND Request_documentID = ?
          GROUP BY MONTH(Request_Date)
) t1
   GROUP BY YEAR(t1.request_date)`;
    try {
      const theRoleIdAndDepId = await getRoleIDandDepartmentID(userInfo.id); //getting the role id and department id of the admin user
      const RoleID = theRoleIdAndDepId[0].roleID; //the role id of admin user
      const DepID = theRoleIdAndDepId[0].depID; // the department id of admin user
      const valuesOfGettingSignatoryId = [RoleID, DepID, documentID];
      const theSignatoriesIdOfDocument = await getTheSignatoriesId(
        valuesOfGettingSignatoryId
      );

      const theSignatoryId = [
        theSignatoriesIdOfDocument[0].id,
        theSignatoriesIdOfDocument[1].id,
      ];
      const values = [theSignatoryId, 1];
      const dailyRequest = await countDailyRequest(values, queryForDaily);
      const monthlyRequest = await countMonthlyRequest(values, queryForMonthly);
      const yearlyRequest = await countYearlyRequest(values, queryForYearly);
      const values1 = [theSignatoryId, 3];
      const dailyRequest1 = await countDailyRequest(values1, queryForDaily);
      const monthlyRequest2 = await countMonthlyRequest(
        values1,
        queryForMonthly
      );
      const yearlyRequest3 = await countYearlyRequest(values1, queryForYearly);

      const allTheCount = [
        dailyRequest,
        monthlyRequest,
        yearlyRequest,
        dailyRequest1,
        monthlyRequest2,
        yearlyRequest3,
      ];

      return res.status(200).json(allTheCount);
    } catch (err) {
      console.log(err);
      res.status(500).json("something went wrong");
    }
  });
};
