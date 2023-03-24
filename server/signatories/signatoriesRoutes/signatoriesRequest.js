import express from "express";
import {
  getAllRequestCFRD,
  getAllRequestHD,
  getAllRequestWDF,
  validateRequestHD,
  validateRequestTor,
  validateRequestWDF
} from "../signatoriesController/request.js";
const router = express.Router();

router.get("/getAllRequestCFRD", getAllRequestCFRD);
router.get("/getAllRequestHD", getAllRequestHD);
router.get("/getAllRequestWDF", getAllRequestWDF);

router.put("/CFRD/:id", validateRequestTor)
router.put("/HD/:id", validateRequestHD)
router.put("/WDF/:id", validateRequestWDF)
export default router;
