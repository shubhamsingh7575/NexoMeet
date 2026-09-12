import { Router } from "express";
import {
    clearMeetingHistory,
    createMeeting,
    deleteMeeting,
    getMeetingById,
    getMeetings
} from "../controllers/meeting.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.get("/", getMeetings);
router.post("/", createMeeting);
router.delete("/", clearMeetingHistory);
router.get("/:id", getMeetingById);
router.delete("/:id", deleteMeeting);

export default router;
