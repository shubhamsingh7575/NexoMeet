import { AppError } from "../utils/AppError.js";
import { sendMeetingInviteEmail } from "../services/email.service.js";

const sentInvites = new Map();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendMeetingInvite = async (req, res, next) => {
    try {
        const recipientEmail = req.body.recipientEmail?.trim().toLowerCase();
        const meetingCode = req.body.meetingCode?.trim();
        const note = req.body.note?.trim() || "";

        if (!recipientEmail || !emailPattern.test(recipientEmail)) {
            throw new AppError("A valid recipient email is required", 400);
        }
        if (!meetingCode || meetingCode.length > 100) {
            throw new AppError("A valid meeting code is required", 400);
        }
        if (note.length > 500) {
            throw new AppError("Message cannot exceed 500 characters", 400);
        }

        const now = Date.now();
        const recentInvites = sentInvites.get(req.user.username) || [];
        const validInvites = recentInvites.filter((timestamp) => now - timestamp < 60 * 60 * 1000);
        if (validInvites.length >= 10) {
            throw new AppError("Invite limit reached. Please try again later", 429);
        }

        await sendMeetingInviteEmail({
            to: recipientEmail,
            senderName: req.user.username,
            meetingCode,
            note,
            joinUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/${encodeURIComponent(meetingCode)}`
        });

        sentInvites.set(req.user.username, [...validInvites, now]);
        return res.status(202).json({
            success: true,
            message: "Meeting invitation sent successfully"
        });
    } catch (error) {
        return next(error);
    }
};

export { sendMeetingInvite };
