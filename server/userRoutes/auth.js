import express from "express";
import {
  register,
  login,
  logout,
  editPassword,
  editEmail,
  // adminLogin,
  // adminLogout,
} from "../userController/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/editPassowrd", editPassword);
router.put("/editEmail", editEmail);
// router.put("/adminLogin", adminLogin);
// router.post("/adminLogout", adminLogout);
export default router;
