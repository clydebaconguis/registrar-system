import express from "express";
import {getTotalRequests,dailyRequests,documentStatus,hdStatus,wdfStatus} from "../signatoriesController/status.js"
const router = express.Router();
router.get("/getTotalRequests", getTotalRequests);
router.get("/documentStatus", documentStatus);
router.get("/requests/data", dailyRequests);
router.get("/documentStatus/wdf", wdfStatus);
router.get("/documentStatus/hd", hdStatus)
export default router;
