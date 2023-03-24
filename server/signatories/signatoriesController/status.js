import { db } from "../../db.js";
import jwt from "jsonwebtoken";
import { response } from "express";

export const getTotalRequests = (req, res) => {
  const token = req.session.signatories;
  const documentCfrdID = 1;
  const documentHdID = 3;
  const Data = [];
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
      GROUP BY Signatories_documentID `;
      db.query(q, [roleID, depID, documentCfrdID], (err, cfrdId) => {
        if (err) return console.log(err);

        const cfrdID = cfrdId.length > 0 ? cfrdId[0].id : 0;

        const q = `SELECT COUNT(Clearance_signatoriesID) as totalCFRD FROM clearance WHERE Clearance_signatoriesID = ?`;

        db.query(q, [cfrdID], (err, totalCfrd) => {
          if (err) return console.log(err);
          Data.push(totalCfrd[0].totalCFRD);
          const q = `SELECT Signatories_ID as id
          FROM signatories  
          WHERE Signatories_adminRoleID = ? 
          AND Signatories_departmentID = ? 
          AND Signatories_documentID = ?
          GROUP BY Signatories_documentID `;
          db.query(q, [roleID, depID, documentHdID], (err, hdId) => {
            if (err) return console.log(err);

            const HdID = hdId.length > 0 ? hdId[0].id : 0;
            const q = `SELECT COUNT(Clearance_signatoriesID) as totalHD FROM clearance WHERE Clearance_signatoriesID = ?`;
            db.query(q, [HdID], (err, totalHd) => {
              if (err) return console.log(err);
              Data.push(totalHd[0].totalHD);

              res.send(Data);
            });
          });
        });
      });
    });
  });
};

export const dailyRequests = (req, res) => {
  const token = req.session.signatories;
  const documentID = [1, 3];
  const Data = [];
  const sigID = [];

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
      GROUP BY Signatories_documentID `;

      db.query(q, [roleID, depID, documentID], (err, result) => {
        if (err) return console.log(err);
        for (let i = 0; i < result.length; i++) {
          sigID.push(result[i].id);
        }

        const q = `SELECT MONTHNAME(t1.request_date) as date,DAY(t1.request_date) as day, YEAR(t1.request_date) as year,  SUM(t1.count) as total_requests
        FROM (
          SELECT Clearance_dateUpdated as request_date, COUNT(*) as count FROM clearance WHERE clearance_dateUpdated IS NOT NULL AND Clearance_signatoriesID IN (?)  GROUP BY DATE(Clearance_dateUpdated)   ) t1
        GROUP BY DATE(t1.request_date)`;
        db.query(q, [sigID], (err, result) => {
          if (err) return console.log(err);
          Data.push(result);
          const q = `SELECT MONTHNAME(t1.request_date) as date, YEAR(t1.request_date) as year,  SUM(t1.count) as total_requests
              FROM (
                SELECT Clearance_dateUpdated as request_date, COUNT(*) as count FROM clearance WHERE Clearance_dateUpdated IS NOT NULL AND Clearance_signatoriesID IN (?)  GROUP BY MONTH(Clearance_dateUpdated)
            ) t1
              GROUP BY MONTH(t1.request_date)`;

          db.query(q, [sigID], (err, response) => {
            if (err) return console.log(err);
            Data.push(response);
            const q = `SELECT YEAR(t1.request_date) as year,  SUM(t1.count) as total_requests
                FROM (
                  SELECT Clearance_dateUpdated as request_date, COUNT(*) as count FROM clearance WHERE Clearance_dateUpdated IS NOT NULL AND Clearance_signatoriesID IN (?)  GROUP BY MONTH(Clearance_dateUpdated)
    ) t1
                GROUP BY YEAR(t1.request_date)`;

            db.query(q, [sigID], (err, data) => {
              if (err) return console.log(err);
              Data.push(data);
              res.send(Data);
            });
          });
        });
      });
    });
  });
};

export const documentStatus = (req, res) => {
  const token = req.session.signatories;
  const documentCfrdID = 1;
  const Data = [];

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
      AND Signatories_documentID =?
      GROUP BY Signatories_documentID 
     `;

      db.query(q, [roleID, depID, documentCfrdID], (err, signatoryID) => {
        if (err) return console.log(err);

        const signatoriesID = signatoryID[0].id;

        const q = `SELECT COUNT(*) as Total_Pending FROM clearance WHERE Clearance_adminNote = ? AND Clearance_signatoriesID =?`;
        db.query(q, ["PENDING", signatoriesID], (err, pending) => {
          if (err) return console.log(err);
          Data.push(pending[0].Total_Pending);
          const q = `SELECT COUNT(*) as Total_Approved FROM clearance WHERE Clearance_adminNote = ? AND Clearance_signatoriesID =?`;
          db.query(q, ["APPROVED", signatoriesID], (err, approved) => {
            if (err) return console.log(err);
            Data.push(approved[0].Total_Approved);
            const q = `SELECT COUNT(*) as Total_Declined FROM clearance WHERE Clearance_adminNote = ? AND Clearance_signatoriesID =?`;
            if (err) return console.log(err);
            db.query(q, ["DECLINED", signatoriesID], (err, declined) => {
              if (err) return console.log(err);
              Data.push(declined[0].Total_Declined);
              res.send(Data);
            });
          });
        });
      });
    });
  });
};

export const hdStatus = (req, res) => {
  const token = req.session.signatories;
  const documentHdID = 3;
  const Data = [];
  const signatoriesID = [];

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

      db.query(q, [roleID, depID, documentHdID], (err, signatoryID) => {
        const signatoriesID = signatoryID[0].id;

        db.query(q, [userInfo.id], (err, adminID) => {
          const q = `SELECT COUNT(*) as Total_Pending FROM clearance WHERE Clearance_adminNote = ?AND Clearance_signatoriesID =?`;
          db.query(q, ["PENDING", signatoriesID], (err, pending) => {
            if (err) return console.log(err);
            Data.push(pending[0].Total_Pending ? pending[0].Total_Pending : 0);
            const q = `SELECT COUNT(*) as Total_Approved FROM clearance WHERE Clearance_adminNote = ?AND Clearance_signatoriesID =?`;
            db.query(q, ["APPROVED", signatoriesID], (err, approved) => {
              if (err) return console.log(err);
              Data.push(
                approved[0].Total_Approved ? approved[0].Total_Approved : 0
              );
              const q = `SELECT COUNT(*) as Total_Declined FROM clearance WHERE Clearance_adminNote = ?AND Clearance_signatoriesID =?`;
              if (err) return console.log(err);
              db.query(q, ["DECLINED", signatoriesID], (err, declined) => {
                if (err) return console.log(err);
                Data.push(
                  declined[0].Total_Declined ? declined[0].Total_Declined : 0
                );
                res.send(Data);
              });
            });
          });
        });
      });
    });
  });
};

export const wdfStatus = (req, res) => {
  const token = req.session.signatories;
  const documentID = [1, 2, 3];
  const Data = [];
  const signatoriesID = [];
  const field = documentID.map(() => "?").join(",");
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

        db.query(q, [userInfo.id], (err, adminID) => {
          const q = `SELECT COUNT(*) as Total_Pending FROM wdf_clearance WHERE WDFClearance_adminNote =? AND WDFClearance_signatoriesID IN (?)`;

          db.query(q, ["PENDING", signatoriesID], (err, pending) => {
            if (err) return console.log(err);
            Data.push(pending[0].Total_Pending ? pending[0].Total_Pending : 0);
            const q = `SELECT COUNT(*) as Total_Approved FROM wdf_clearance WHERE WDFClearance_adminNote =? AND WDFClearance_signatoriesID IN (?)`;
            db.query(q, ["APPROVED", signatoriesID], (err, approved) => {
              if (err) return console.log(err);
              Data.push(
                approved[0].Total_Approved ? approved[0].Total_Approved : 0
              );
              const q = `SELECT COUNT(*) as Total_Declined  FROM wdf_clearance WHERE WDFClearance_adminNote =? AND WDFClearance_signatoriesID IN (?)`;
              if (err) return console.log(err);
              db.query(q, ["DECLINED", signatoriesID], (err, declined) => {
                if (err) return console.log(err);
                Data.push(
                  declined[0].Total_Declined ? declined[0].Total_Declined : 0
                );
                res.send(Data);
              });
            });
          });
        });
      });
    });
  });
};
