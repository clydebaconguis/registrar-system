import express from "express";
const router = express.Router();
import {
  pending,
  monthly,
  courses,
  profile,
  getUserProfile

} from "../userController/status.js";

router.get("/pending", pending);
router.get("/courses", courses);
router.post("/months", monthly);
router.get("/profile/:id", profile);
router.get("/getUserProfile", getUserProfile)



export default router;
