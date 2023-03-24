import { db } from "../../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signatoriesLogin = (req, res) => {
  const username = req.body.username;

  const q = "SELECT * FROM users WHERE User_Username = ?";
  db.query(q, [username], (err, result) => {
    if (err) return res.json(err);
    if (result.length === 0) return res.status(404).json("User not found!");

    const token = jwt.sign({ id: result[0].User_ID }, "signatories_jwtkey");
    const { User_Password, User_Role, ...others } = result[0];
    req.session.signatories = token;
    res.status(200).json({ token: token, userRole: result[0].User_Role });

 
  });
};

export const signatoriesLogout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie("signatories").json("cookie deleted"); // clear the cookie
    }
  });
};
