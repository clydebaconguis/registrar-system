import express from "express";
import { signatoriesLogin,signatoriesLogout } from "../signatoriesController/auth.js";
const router = express.Router();
router.post("/signatoriesLogin",signatoriesLogin)
router.post("/signatoriesLogout",signatoriesLogout)
export default router;
