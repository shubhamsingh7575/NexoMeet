import { Router } from "express";
import { sendMeetingInvite } from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.post("/email", authenticate, sendMeetingInvite);

export default router;
