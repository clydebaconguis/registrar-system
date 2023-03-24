import express from "express";
import {
  getAllTheCFRDRequests,
  updateRequest,
  holdApprovedRequest,
  getAllHdRequest,
  getAdminRoleAndDepartments
} from "../superadminController/request.js";
const router = express.Router();
router.get("/getRequestsCFRD", getAllTheCFRDRequests);
router.put("/CFRD/:id", updateRequest);
router.put("/holdApprovedRequest/:id", holdApprovedRequest);
router.get("/getRequestsHD", getAllHdRequest);
router.get("/getAdminRoleAndDepartments", getAdminRoleAndDepartments);
export default router;
