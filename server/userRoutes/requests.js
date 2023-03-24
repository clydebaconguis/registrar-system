import express from "express";
import {
  getRequestAllValidatedRequestCFRD,
  deleteRequest,
  getRequestHd,
  addProfile,
  getRequestCfrdValidating,
  getRequestHDValidating,
  addRequest,
} from "../userController/request.js";
const router = express.Router();
router.post("/addRequest", addRequest);
router.delete("/:id", deleteRequest);
router.get("/allrequest", getRequestAllValidatedRequestCFRD); //get all transcript of records requests for students
router.get("/getRequestHd", getRequestHd); //get all honorable form request for student
router.post("/addProfile", addProfile); //add profile to a user
router.get("/getRequestValidating", getRequestCfrdValidating);
router.get("/getRequestHDValidating", getRequestHDValidating);
export default router;
