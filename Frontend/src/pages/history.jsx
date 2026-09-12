import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function History() {
    const { getHistoryOfUser, deleteMeeting, clearMeetingHistory } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () =>  {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // IMPLEMENT SNACKBAR
            }
        };
        fetchHistory();

        // Fetch history once when the page mounts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    let formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    };

    const handleDeleteMeeting = async (meetingId) => {
        if (!window.confirm("Delete this meeting from history?")) return;

        await deleteMeeting(meetingId);
        setMeetings((current) => current.filter((meeting) => meeting._id !== meetingId));
    };

    const handleClearHistory = async () => {
        if (!meetings.length || !window.confirm("Clear your complete meeting history?")) return;

        await clearMeetingHistory();
        setMeetings([]);
    };


    return (
        <div className="historyPage" style={{
            minHeight: "100vh",
            background: "#0a192f",
            padding: "30px"
        }}>
            <div className="historyHeader">
                <Button
                    onClick={() => routeTo("/home")}
                    startIcon={<HomeIcon />}
                    style={{ color: "white", backgroundColor: "#0077b6", padding: "8px 16px", textTransform: "none", borderRadius: "8px" }}
                >
                    Home
                </Button>
                <Button
                    onClick={handleClearHistory}
                    disabled={!meetings.length}
                    startIcon={<DeleteOutlineIcon />}
                    style={{ color: "white", backgroundColor: meetings.length ? "#d64545" : "#536174", padding: "8px 16px", textTransform: "none", borderRadius: "8px" }}
                >
                    Clear history
                </Button>
            </div>


            {/* History List */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                maxWidth: "600px",
                margin: "0 auto"
            }}>
                {meetings.length !== 0 ? (
                    meetings.map((e, i) => (
                        <Card
                            key={e._id || i}
                            variant="outlined"
                            style={{
                                backgroundColor: "#1b263b",
                                color: "white",
                                borderRadius: "12px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                            }}
                        >
                            <CardContent>
                                <Typography sx={{ fontSize: 16, fontWeight: "bold" }} gutterBottom>
                                    #{i + 1} &nbsp; Code: {e.meetingCode}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }}>
                                    Date: {formatDate(e.date)}
                                </Typography>
                                <Typography sx={{ fontSize: 14 }}>
                                    Time: {formatTime(e.date)}
                                </Typography>
                                <Button
                                    onClick={() => handleDeleteMeeting(e._id)}
                                    startIcon={<DeleteOutlineIcon />}
                                    size="small"
                                    sx={{ mt: 2, color: "#ff9d9d", textTransform: "none" }}
                                >
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography style={{ color: "white", textAlign: "center" }}>
                        No meeting history found
                    </Typography>
                )}
            </div>
        </div>
    );
}

const ProtectedHistory = withAuth(History);
export default ProtectedHistory;
