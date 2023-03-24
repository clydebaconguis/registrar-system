import express from "express";
import {
  countAllRequest,
  countAllDailyMonthlyYearlyRequest,
  countAllRequestPerDocument,

  //   hdStatus,
} from "../adminController/status.js";
const router = express.Router();

router.get("/getTotalRequests", countAllRequest);
router.get("/requests/data", countAllDailyMonthlyYearlyRequest);
router.get("/requests/data/perDocument", countAllRequestPerDocument);

export default router;
