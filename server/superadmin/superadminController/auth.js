import { db } from "../../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const superAdminLogin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const q = "SELECT * FROM users WHERE User_Username = ?";
  db.query(q, [username], (err, result) => {
    if (err) return res.json(err);
    if (result.length === 0) return res.status(404).json("User not found!");

    bcrypt
      .compare(password, result[0].User_Password)
      .then((isPasswordCorrect) => {
        // check if passwords match
        if (isPasswordCorrect && result[0].User_Role === "SUPERADMIN") {
          // passwords match
          // do something

          const token = jwt.sign(
            { id: result[0].User_ID },
            "superadmin_jwtkey"
          );
          const { User_Password, User_Role, ...others } = result[0];
          req.session.superadmin = token;
          return res
            .status(200)
            .json({ token: token, userRole: result[0].User_Role });
        } else {
          // passwords do not match
          // do something else
          return res.status(400).json("Wrong Username and Password");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

export const superAdminLogout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie("superadmin").json("cookie deleted"); // clear the cookie
    }
  });
};

const functionWithoutQuery = (values, query) => {
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

const functionWithoutResponseID = (values, query) => {
  return new Promise((resolve, reject) => {
    db.query(query, [values], (err, result) => {
      if (err) {
        return reject(err);
      }
      {
        return resolve(result.insertId);
      }
    });
  });
};

export const registerAccount = (req, res) => {
  const token = req.session.superadmin;
  const values = req.body.values;
  const date = new Date();
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "superadmin_jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const queryForCheckUser = `SELECT * FROM users WHERE User_Username = ?`;
    const queryCreateUser = `INSERT INTO users 
    (User_Username, 
    User_Password,
    User_emailAddress,
    User_Role,
    User_dateCreated) VALUES(?)`;
    const queryForAdminProfile = `INSERT INTO admin_profile 
    (Admin_firstName,
      Admin_lastName,
      Admin_middleName,
      Admin_departmentID,
      Admin_userID,
      Admin_roleID) VALUES(?)`;

    if (values.signatoriesRole !== 10) {
      try {
        const values1 = [values.username];
        const isUserExist = await functionWithoutQuery(
          values1,
          queryForCheckUser
        );

        if (isUserExist.length > 0) {
          return res.status(409).json("User already exist");
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(values.password, salt);
        const values2 = [
          values.username,
          hash,
          values.email,
          "SIGNATORIES",
          date,
        ];
        const createUser = await functionWithoutResponseID(
          values2,
          queryCreateUser
        );
        const values3 = [
          values.firstname,
          values.lastname,
          values.middlename,
          values.department,
          createUser,
          values.signatoriesRole,
        ];
        const createProfileInfo = await functionWithoutQuery(
          values3,
          queryForAdminProfile
        );

        return res.status(200).json("SIGNATORIES ACCOUNT CREATED");
      } catch (error) {
        console.log(error);
        return res.status(500).json("CREATING ACCOUNT UNSUCCESFUL");
      }
    }

    if (values.signatoriesRole === 10) {
      try {
        const values1 = [values.username];
        const isUserExist = await functionWithoutQuery(
          values1,
          queryForCheckUser
        );
        if (isUserExist.length > 0) {
          return res.status(409).json("User already exist");
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(values.password, salt);
        const values2 = [values.username, hash, values.email, "ADMIN", date];
        const createUser = await functionWithoutResponseID(
          values2,
          queryCreateUser
        );
        const values3 = [
          values.firstname,
          values.lastname,
          values.middlename,
          values.department,
          createUser,
          values.signatoriesRole,
        ];

        const createProfileInfo = await functionWithoutQuery(
          values3,
          queryForAdminProfile
        );

        return res.status(200).json("REGISTRAR STAFF ACCOUNT CREATED");
      } catch (error) {
        console.log(error);
        return res.status(500).json("CREATING ACCOUNT UNSUCCESFUL");
      }
    }
  });
};
