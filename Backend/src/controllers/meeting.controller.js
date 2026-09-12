import mongoose from "mongoose";
import { Meeting } from "../models/meeting.model.js";
import { AppError } from "../utils/AppError.js";

const getPagination = (query) => {
    const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
    return { page, limit, skip: (page - 1) * limit };
};

const validateMeetingCode = (value) => {
    const code = value?.trim();
    if (!code || code.length > 100) throw new AppError("A valid meeting code is required", 400);
    return code;
};

const getMeetings = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const filter = { user_id: req.user.username };
        const [meetings, total] = await Promise.all([
            Meeting.find(filter).sort({ date: -1 }).skip(skip).limit(limit).lean(),
            Meeting.countDocuments(filter)
        ]);

        return res.json({
            success: true,
            data: meetings,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        return next(error);
    }
};

const createMeeting = async (req, res, next) => {
    try {
        const meetingCode = validateMeetingCode(req.body.meeting_code);

        const meeting = await Meeting.create({
            user_id: req.user.username,
            meetingCode
        });

        return res.status(201).json({
            success: true,
            message: "Meeting added to history",
            data: meeting
        });
    } catch (error) {
        return next(error);
    }
};

const getMeetingById = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) throw new AppError("Invalid meeting id", 400);

        const meeting = await Meeting.findOne({
            _id: req.params.id,
            user_id: req.user.username
        }).lean();

        if (!meeting) throw new AppError("Meeting not found", 404);
        return res.json({ success: true, data: meeting });
    } catch (error) {
        return next(error);
    }
};

const deleteMeeting = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) throw new AppError("Invalid meeting id", 400);

        const deleted = await Meeting.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.username
        });

        if (!deleted) throw new AppError("Meeting not found", 404);
        return res.json({ success: true, message: "Meeting deleted successfully" });
    } catch (error) {
        return next(error);
    }
};

const clearMeetingHistory = async (req, res, next) => {
    try {
        const result = await Meeting.deleteMany({ user_id: req.user.username });
        return res.json({
            success: true,
            message: "Meeting history cleared",
            data: { deletedCount: result.deletedCount }
        });
    } catch (error) {
        return next(error);
    }
};

export { getMeetings, createMeeting, getMeetingById, deleteMeeting, clearMeetingHistory };
