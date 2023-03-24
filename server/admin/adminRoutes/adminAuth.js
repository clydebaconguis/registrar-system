import express from "express";
import { adminLogout } from "../adminController/auth.js";
import { adminLogin } from "../adminController/auth.js";
const router = express.Router();


router.post("/adminLogin", adminLogin);
router.post("/adminLogout", adminLogout);
export default router;