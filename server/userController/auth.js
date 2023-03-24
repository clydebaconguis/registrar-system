import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const role = "students";

  //check if username is already exist
  const q = "SELECT * FROM users WHERE User_Username = ?";

  db.query(q, [username], (err, result) => {
    if (err) return res.json(err);
    if (result.length) return res.status(409).json("User already exist");

    //if no username existed

    //hashing the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    //done hashing

    //creating user
    const q =
      "INSERT INTO users(`User_Username`, `User_Password`, `User_emailAddress`,`User_Role`) VALUES (?)";
    const values = [username, hash, email, role];

    db.query(q, [values], () => {
      if (err) return res.json(err);
      res.status(200).json("User has beeen created.");
    });
    //end of creating user
  });
};

export const login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //check if username exist
  const q = "SELECT * FROM users WHERE User_Username = ?";
  db.query(q, [username], (err, result) => {
    if (err) return res.json(err);
    if (result.length === 0) return res.status(404).json("User not found!");

    //if username exist then check password

    bcrypt
      .compare(password, result[0].User_Password)
      .then((isPasswordCorrect) => {
        // check if passwords match
        if (isPasswordCorrect) {
          // passwords match
          // do something
          const token = jwt.sign({ id: result[0].User_ID }, "jwtkey");
          const { User_Password, User_Role, ...others } = result[0];
          req.session.user = token;

          return res.status(200).json(others);
        } else {
          // passwords do not match
          // do something else
          return res.status(400).json("Wrong Username and Password");
        }
      })
      .catch((error) => {
        return console.log(error);
      });
  });
};

export const logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie("user").json("cookie deleted"); // clear the cookie
    }
  });
};

export const editPassword = (req, res) => {
  const token = req.session.user;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const q = "SELECT * from users WHERE User_ID =?";

    db.query(q, [userInfo.id], (err, result) => {
      if (err) return console.log(err);
      bcrypt
        .compare(currentPassword, result[0].User_Password)
        .then((isPasswordCorrect) => {
          // check if passwords match
          if (isPasswordCorrect) {
            // passwords match
            // do something

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPassword, salt);

            const q = `UPDATE users SET User_Password = ? WHERE User_ID = ?`;
            const values = [hash, userInfo.id];
            db.query(q, values, (err, response) => {
              if (err) return console.log(err);
              return res.status(200).json("Your password has beeen updated.");
            });
          } else {
            // passwords do not match
            // do something else
            return res.status(500).json("Current password incorrect!");
          }
        })
        .catch((err) => {
          // handle error
          return res.status(500).json("Current password incorrect!");
        });
    });
  });
};

export const editEmail = (req, res) => {
  const token = req.session.user;
  const currentPassword = req.body.currentPassword;
  const newEmail = req.body.email;
  if (!token) return res.status(401).json("Not Authenticated");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User not valid");
    const q = "SELECT * from users WHERE User_ID =?";

    db.query(q, [userInfo.id], (err, result) => {
      if (err) return console.log(err);
      bcrypt
        .compare(currentPassword, result[0].User_Password)
        .then((isPasswordCorrect) => {
          // check if passwords match
          if (isPasswordCorrect) {
            // passwords match
            // do something

            const q = `UPDATE users SET User_emailAddress= ? WHERE User_ID = ?`;
            const values = [newEmail, userInfo.id];
            db.query(q, values, (err, response) => {
              if (err) return console.log(err);
              return res.status(200).json("Your email has beeen updated.");
            });
          } else {
            // passwords do not match
            // do something else
            return res.status(500).json("Current password incorrect!");
          }
        })
        .catch((err) => {
          // handle error
          return res.status(500).json("Current password incorrect!");
        });
    });
  });
};
