import axios from "axios";
import httpStatus from "http-status";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";
import { AuthContext } from "./AuthContextValue";

export { AuthContext };

const client = axios.create({
    baseURL: `${server}/api/v1`
})

client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});


export const AuthProvider = ({ children }) => {

    const [userData, setUserData] = useState({});


    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        const payload = { name, username, password };
        const request = await client.post("/auth/register", payload);
        if (request.status === httpStatus.CREATED) {
            return request.data.message;
        }
    }

    const handleLogin = async (username, password) => {
        const payload = { username, password };
        const request = await client.post("/auth/login", payload);
        if (request.status === httpStatus.OK) {
            localStorage.setItem("token", request.data.token);
            router("/home");
        }
    }

    const handleLogout = async () => {
        try {
            if (localStorage.getItem("token")) {
                await client.post("/auth/logout");
            }
        } finally {
            localStorage.removeItem("token");
            router("/");
        }
    }

    const getHistoryOfUser = async () => {
        const request = await client.get("/meetings");
        return request.data.data;
    }

    const addToUserHistory = async (meetingCode) => {
        return client.post("/meetings", { meeting_code: meetingCode });
    }

    const deleteMeeting = async (meetingId) => {
        return client.delete(`/meetings/${meetingId}`);
    }

    const clearMeetingHistory = async () => {
        return client.delete("/meetings");
    }

    const sendMeetingInvite = async (recipientEmail, meetingCode, note) => {
        return client.post("/notifications/email", {
            recipientEmail,
            meetingCode,
            note
        });
    }


    const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, deleteMeeting,
        clearMeetingHistory, sendMeetingInvite, handleRegister, handleLogin, handleLogout
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}
