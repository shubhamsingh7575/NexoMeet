import { AppError } from "../utils/AppError.js";

const escapeHtml = (value = "") => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const sendMeetingInviteEmail = async ({ to, senderName, meetingCode, note, joinUrl }) => {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
        throw new AppError("Add SENDGRID_API_KEY and SENDGRID_FROM_EMAIL to Backend/.env", 503);
    }

    const safeSender = escapeHtml(senderName);
    const safeCode = escapeHtml(meetingCode);
    const safeNote = escapeHtml(note);
    const safeJoinUrl = escapeHtml(joinUrl);

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            personalizations: [{ to: [{ email: to }] }],
            from: { email: fromEmail, name: "NexoMeet" },
            subject: `${safeSender} invited you to a NexoMeet call`,
            content: [
                {
                    type: "text/plain",
                    value: `${senderName} invited you to join a NexoMeet call.\n\nMeeting code: ${meetingCode}\nJoin link: ${joinUrl}${note ? `\n\nMessage: ${note}` : ""}`
                },
                {
                    type: "text/html",
                    value: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#142033"><h2 style="color:#6b39ff">NexoMeet invitation</h2><p><strong>${safeSender}</strong> invited you to join a video meeting.</p><p>Meeting code: <strong>${safeCode}</strong></p>${safeNote ? `<p>Message: ${safeNote}</p>` : ""}<p><a href="${safeJoinUrl}" style="display:inline-block;padding:12px 18px;background:#6b39ff;color:#fff;text-decoration:none;border-radius:8px">Join meeting</a></p></div>`
                }
            ]
        })
    });

    if (!response.ok) {
        const details = await response.text();
        console.error("SendGrid request failed:", response.status, details);
        throw new AppError("Unable to send the meeting invitation", 502);
    }
};
