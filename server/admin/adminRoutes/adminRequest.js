import express from "express";
import {
  getAllRequestWDF,
  updateRequest,
  getAllHdRequest,
  validateRequestHD,
  validateRequestWDF,
  // approveHdRequest,
  approveCFRDRequest,
  approveWdfRequest,
  holdApprovedRequest,
  getAllTheCFRDRequests,
} from "../adminController/request.js";

const router = express.Router();
router.get("/getRequestsCFRD", getAllTheCFRDRequests); //get all who request a TOR for admin
router.get("/getRequestsWDF", getAllRequestWDF); //get all who request a withdrawal form
router.put("/CFRD/:id", updateRequest);
router.get("/getRequestsHD", getAllHdRequest);
router.put("/HD/:id", validateRequestHD);
router.put("/WDF/:id", validateRequestWDF);
// router.put("/approveHdRequest", approveHdRequest);
router.put("/approveCFRDRequest", approveCFRDRequest);
router.put("/approveWdfRequest", approveWdfRequest);
router.put("/holdApprovedRequest/:id", holdApprovedRequest);

export default router;
