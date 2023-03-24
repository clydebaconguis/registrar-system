import express from "express";
import {
  superAdminLogin,
  superAdminLogout,
  registerAccount,
} from "../superadminController/auth.js";
const router = express.Router();
router.post("/superadminLogin", superAdminLogin);
router.post("/superadminLogout", superAdminLogout);
router.post("/registerAccount", registerAccount);
export default router;
