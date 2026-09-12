import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { createToken, revokeToken } from "../middleware/auth.js";

const cleanUser = (user) => ({
    id: user._id,
    name: user.name,
    username: user.username
});

const register = async (req, res, next) => {
    try {
        const name = req.body.name?.trim();
        const username = req.body.username?.trim().toLowerCase();
        const password = req.body.password;

        if (!name || !username || !password) {
            throw new AppError("Name, username and password are required", 400);
        }
        if (name.length < 2 || name.length > 80) {
            throw new AppError("Name must be between 2 and 80 characters", 400);
        }
        if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
            throw new AppError("Username must be 3-30 characters and use letters, numbers, ., _ or -", 400);
        }
        if (typeof password !== "string" || password.length < 8 || password.length > 72) {
            throw new AppError("Password must be between 8 and 72 characters", 400);
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) throw new AppError("User already exists", 409);

        const user = await User.create({
            name,
            username,
            password: await bcrypt.hash(password, 12)
        });

        return res.status(httpStatus.CREATED).json({
            success: true,
            message: "User registered successfully",
            data: { user: cleanUser(user) }
        });
    } catch (error) {
        return next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const username = req.body.username?.trim().toLowerCase();
        const { password } = req.body;

        if (!username || !password) {
            throw new AppError("Username and password are required", 400);
        }

        const user = await User.findOne({ username });
        const passwordMatches = user && await bcrypt.compare(password, user.password);

        if (!user || !passwordMatches) {
            throw new AppError("Invalid username or password", 401);
        }

        const token = createToken(user);
        return res.status(httpStatus.OK).json({
            success: true,
            message: "Login successful",
            token,
            data: { user: cleanUser(user) }
        });
    } catch (error) {
        return next(error);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.user.username }).select("name username createdAt");
        if (!user) throw new AppError("User not found", 404);

        return res.json({ success: true, data: { user } });
    } catch (error) {
        return next(error);
    }
};

const logout = (req, res) => {
    revokeToken(req.token);
    return res.json({ success: true, message: "Logged out successfully" });
};

export { register, login, getCurrentUser, logout };
