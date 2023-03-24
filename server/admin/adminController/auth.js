import { db } from "../../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminLogin = (req, res) => {
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
        if (isPasswordCorrect && result[0].User_Role === "ADMIN") {
          // passwords match
          // do something

          const token = jwt.sign({ id: result[0].User_ID }, "admin_jwtkey");
          const { User_Password, User_Role, ...others } = result[0];
          req.session.admin = token;
          return res
            .status(200)
            .json({ token: token, userRole: result[0].User_Role });
        } else if (isPasswordCorrect && result[0].User_Role === "SIGNATORIES") {
          const Data = {
            username: username,
            password: password,
            userRole: result[0].User_Role,
          };

          res.send(Data);
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

export const adminLogout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie("admin").json("cookie deleted"); // clear the cookie
    }
  });
};
