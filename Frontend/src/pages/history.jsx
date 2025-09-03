import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { Button, IconButton } from '@mui/material';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // IMPLEMENT SNACKBAR
            }
        };
        fetchHistory();
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


    return (
        <div style={{
            minHeight: "100vh",
            background: "#0a192f",
            padding: "30px"
        }}>
            {/* Home Button */}
            <Button
                onClick={() => routeTo("/home")}
                startIcon={<HomeIcon />}
                style={{
                    color: "white",
                    backgroundColor: "#0077b6",
                    marginBottom: "20px",
                    padding: "8px 16px",
                    textTransform: "none",
                    borderRadius: "8px"
                }}
            >
                Home
            </Button>


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
                            key={i}
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