import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Alert, Button, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {


    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [inviteMeetingCode, setInviteMeetingCode] = useState("");
    const [recipientEmail, setRecipientEmail] = useState("");
    const [inviteNote, setInviteNote] = useState("");
    const [inviteStatus, setInviteStatus] = useState(null);


    const { addToUserHistory, sendMeetingInvite, handleLogout } = useContext(AuthContext);
    let handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) return;
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    const handleSendInvite = async () => {
        setInviteStatus(null);
        if (!inviteMeetingCode.trim() || !recipientEmail.trim()) {
            setInviteStatus({ severity: "error", message: "Meeting code and recipient email are required." });
            return;
        }

        try {
            await sendMeetingInvite(recipientEmail, inviteMeetingCode, inviteNote);
            setInviteStatus({ severity: "success", message: "Meeting invitation sent successfully." });
            setRecipientEmail("");
            setInviteNote("");
        } catch (error) {
            setInviteStatus({
                severity: "error",
                message: error.response?.data?.message || "Unable to send invitation."
            });
        }
    };

    return (
        <>

            <div className="navBar">

                <div style={{ display: "flex", alignItems: "center" }}>

                     <h2  style={{ fontSize: "2.5rem" }}><span style={{ color: "#6b39ffff" }}>Nexo</span>Meet</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                        onClick={() => navigate("/history")}
                        variant="outlined"
                        startIcon={<RestoreIcon />}
                        style={{
                            borderColor: "#1976d2",
                            color: "#1976d2",
                            borderRadius: "8px",
                            padding: "6px 16px",
                            fontWeight: "bold",
                            textTransform: "none",
                            marginRight: "10px"
                        }}
                    >
                        History
                    </Button>
                    

                    <Button onClick={handleLogout}
                    variant="contained"
                        style={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            borderRadius: "8px",
                            padding: "6px 16px",
                            fontWeight: "bold",
                            textTransform: "none"
                        }}
                    >
                        Logout
                    </Button>
                </div>


            </div>


            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h2>Where Every Video Call Feels Like Face-to-Face</h2>
                        <br />
                        <p>Connect with your loved ones, no matter the distance. Experience seamless video calls that bring you closer together.</p>
                        <br />

                        <div style={{ display: 'flex', gap: "10px" ,}}>

                            <TextField
                                onChange={e => setMeetingCode(e.target.value)}
                                id="outlined-basic"
                                label="Meeting Code"
                                variant="outlined"
                                value={meetingCode}
                                InputProps={{
                                    style: {
                                        color: "#ffffff",            
                                        backgroundColor: "#2c3e50",  
                                        borderRadius: "8px"
                                    }
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: "#e0e0e0"  
                                    }
                                }}
                            />
                            <Button onClick={handleJoinVideoCall} variant='contained' >Join</Button>

                        </div>

                        <div className="inviteCard">
                            <div className="inviteCardHeader">
                                <div>
                                    <span className="inviteIcon"><MailOutlineIcon /></span>
                                    <div>
                                        <h3>Invite someone</h3>
                                        <p>Send this meeting link by email.</p>
                                    </div>
                                </div>
                            </div>
                            <TextField
                                fullWidth
                                size="small"
                                label="Meeting code"
                                value={inviteMeetingCode}
                                onChange={(e) => setInviteMeetingCode(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                size="small"
                                label="Recipient email"
                                value={recipientEmail}
                                onChange={(e) => setRecipientEmail(e.target.value)}
                                type="email"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                size="small"
                                label="Optional message"
                                value={inviteNote}
                                onChange={(e) => setInviteNote(e.target.value)}
                                multiline
                                minRows={2}
                                margin="normal"
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<MailOutlineIcon />}
                                onClick={handleSendInvite}
                                sx={{ mt: 1, borderRadius: "10px", textTransform: "none", fontWeight: 700 }}
                            >
                                Send invitation
                            </Button>
                            {inviteStatus && <Alert severity={inviteStatus.severity} sx={{ mt: 2 }}>{inviteStatus.message}</Alert>}
                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img srcSet='/logo3.png' alt="" />
                </div>
            </div>
        </>
    )
}


const ProtectedHome = withAuth(HomeComponent);
export default ProtectedHome;
