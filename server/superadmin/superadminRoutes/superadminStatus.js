import express from "express";
const router = express.Router();

import {
  countAllRequest,
  countAllDailyMonthlyYearlyRequest,
  countAllRequestPerDocument,
  getAllAdminUser,
} from "../superadminController/status.js";
router.get("/getTotalRequests", countAllRequest);
router.get("/requests/data", countAllDailyMonthlyYearlyRequest);
router.get("/requests/data/perDocument", countAllRequestPerDocument);
router.get("/getAllAdminUser", getAllAdminUser);
export default router;
